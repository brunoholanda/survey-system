import { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Layout,
  Spin,
  Statistic,
  Row,
  Col,
  List,
  Tag,
  Empty,
  Modal,
  Divider,
} from 'antd';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, TrendingUp, MessageSquare, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { surveysService } from '../services/api';
import Footer from '../components/Footer';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const ResultsContainer = styled(Layout)`
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-wrap: wrap;
  gap: 12px;
  min-height: auto;
  height: auto;

  @media (min-width: 768px) {
    padding: 0 24px;
    flex-wrap: nowrap;
  }

  .ant-typography {
    font-size: 18px;
    
    @media (max-width: 480px) {
      font-size: 16px;
    }
  }
`;

const StyledContent = styled(Content)`
  padding: 24px 16px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 48px 24px;
  }

  @media (min-width: 1024px) {
    padding: 48px;
  }
`;

const StatCard = styled(Card)`
  border-radius: 8px;
  height: 100%;

  .ant-card-body {
    padding: 16px;

    @media (min-width: 768px) {
      padding: 24px;
    }
  }
`;

const ChartCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
  overflow-x: auto;

  .ant-card-body {
    padding: 16px;

    @media (min-width: 768px) {
      padding: 24px;
    }
  }

  /* Garantir que gráficos sejam responsivos */
  .recharts-wrapper {
    width: 100% !important;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .recharts-surface {
      max-width: 100%;
    }
  }
`;

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

interface Statistics {
  totalResponses: number;
  averageSatisfaction: number;
  questionStatistics: Array<{
    formId: string;
    question: string;
    questionType: string;
    totalResponses: number;
    scaleResponses: number;
    textResponses: number;
    average: number;
    distribution: { [key: number]: number };
    textResponsesList: Array<{
      id: string;
      response: string;
      created_at: string;
    }>;
  }>;
  responsesByDate: Array<{ date: string; count: number }>;
  textResponsesCount: number;
  scaleResponsesCount: number;
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionResponses, setSessionResponses] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await surveysService.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseClick = async (surveyId: string) => {
    try {
      setLoadingSession(true);
      setModalVisible(true);
      const data = await surveysService.getResponsesBySession(surveyId);
      setSessionResponses(data);
    } catch (error) {
      console.error('Erro ao carregar respostas da sessão:', error);
    } finally {
      setLoadingSession(false);
    }
  };

  if (loading) {
    return (
      <ResultsContainer>
        <StyledContent>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 24 }}>
              <Text>Carregando estatísticas...</Text>
            </div>
          </div>
        </StyledContent>
      </ResultsContainer>
    );
  }

  if (!statistics || statistics.totalResponses === 0) {
    return (
      <ResultsContainer>
        <StyledHeader>
          <Space>
            <BarChart3 size={24} color="#667eea" />
            <Title level={4} style={{ margin: 0 }}>
              Resultados da Pesquisa
            </Title>
          </Space>
        </StyledHeader>
        <StyledContent>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card>
              <Empty
                description="Ainda não há respostas para exibir estatísticas"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
            <Card>
              <Space>
                <ArrowLeft size={16} />
                <Text
                  onClick={() => navigate('/dashboard')}
                  style={{ cursor: 'pointer' }}
                >
                  Voltar ao Dashboard
                </Text>
              </Space>
            </Card>
          </Space>
        </StyledContent>
        <Footer />
      </ResultsContainer>
    );
  }

  // Preparar dados para gráfico de distribuição geral
  const overallDistribution = statistics.questionStatistics
    .filter((q) => q.questionType !== 'text_opinion')
    .flatMap((q) =>
      Object.entries(q.distribution).map(([value, count]) => ({
        value: parseInt(value),
        count,
        question: q.question.substring(0, 30) + '...',
      })),
    )
    .reduce((acc, item) => {
      const existing = acc.find((a) => a.value === item.value);
      if (existing) {
        existing.count += item.count;
      } else {
        acc.push({ value: item.value, count: item.count });
      }
      return acc;
    }, [] as Array<{ value: number; count: number }>)
    .sort((a, b) => a.value - b.value);

  // Preparar dados para gráfico de respostas por data
  const dateChartData = statistics.responsesByDate.map((item) => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    respostas: item.count,
  }));

  return (
    <ResultsContainer>
      <StyledHeader>
        <Space>
          <BarChart3 size={24} color="#667eea" />
          <Title level={4} style={{ margin: 0 }}>
            Resultados da Pesquisa
          </Title>
        </Space>
        <Space>
          <Text
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer', color: '#667eea' }}
          >
            <ArrowLeft size={16} style={{ marginRight: 8 }} />
            Voltar
          </Text>
        </Space>
      </StyledHeader>
      <StyledContent>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Estatísticas Gerais */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard>
                <Statistic
                  title="Total de Respostas"
                  value={statistics.totalResponses}
                  prefix={<BarChart3 size={20} />}
                />
              </StatCard>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard>
                <Statistic
                  title="Média de Satisfação"
                  value={statistics.averageSatisfaction}
                  precision={2}
                  suffix="/ 10"
                  prefix={<TrendingUp size={20} />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </StatCard>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard>
                <Statistic
                  title="Respostas Escala"
                  value={statistics.scaleResponsesCount}
                  prefix={<BarChart3 size={20} />}
                />
              </StatCard>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard>
                <Statistic
                  title="Respostas Texto"
                  value={statistics.textResponsesCount}
                  prefix={<MessageSquare size={20} />}
                />
              </StatCard>
            </Col>
          </Row>

          {/* Gráfico de Respostas por Data */}
          {dateChartData.length > 0 && (
            <ChartCard>
              <Title level={4}>Respostas ao Longo do Tempo</Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dateChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="respostas"
                    stroke="#667eea"
                    strokeWidth={2}
                    name="Respostas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Gráfico de Distribuição Geral */}
          {overallDistribution.length > 0 && (
            <ChartCard>
              <Title level={4}>Distribuição de Notas (Geral)</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overallDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="value" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#667eea" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Estatísticas por Pergunta */}
          {statistics.questionStatistics.map((question, index) => {
            if (question.questionType === 'text_opinion') {
              return (
                <ChartCard key={question.formId}>
                  <Title level={4}>
                    {index + 1}. {question.question}
                  </Title>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={16}>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="Total de Respostas"
                          value={question.totalResponses}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="Respostas de Texto"
                          value={question.textResponses}
                        />
                      </Col>
                    </Row>
                    {question.textResponsesList.length > 0 && (
                      <List
                        header={<Text strong>Respostas Recebidas:</Text>}
                        bordered
                        dataSource={question.textResponsesList}
                        renderItem={(item) => (
                          <List.Item
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleResponseClick(item.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <Text>{item.response}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {new Date(item.created_at).toLocaleString('pt-BR')}
                              </Text>
                            </Space>
                          </List.Item>
                        )}
                      />
                    )}
                  </Space>
                </ChartCard>
              );
            }

            // Perguntas de escala
            const distributionData = Object.entries(question.distribution)
              .map(([value, count]) => ({
                value: parseInt(value),
                count,
              }))
              .sort((a, b) => a.value - b.value);

            const maxValue = question.questionType === 'scale_0_5' ? 5 : 10;

            return (
              <ChartCard key={question.formId}>
                <Title level={4}>
                  {index + 1}. {question.question}
                </Title>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title="Total de Respostas"
                        value={question.totalResponses}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title="Média"
                        value={question.average}
                        precision={2}
                        suffix={`/ ${maxValue}`}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title="Respostas Válidas"
                        value={question.scaleResponses}
                      />
                    </Col>
                  </Row>

                  {distributionData.length > 0 && (
                    <Row gutter={16}>
                      <Col xs={24} lg={12}>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={distributionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="value"
                              label={{ value: 'Nota', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#667eea" name="Respostas" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col xs={24} lg={12}>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={distributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ value, percent }) =>
                                `${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {distributionData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Col>
                    </Row>
                  )}
                </Space>
              </ChartCard>
            );
          })}
        </Space>
      </StyledContent>
      <Footer />
      <Modal
        title="Detalhes da Resposta Completa"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSessionResponses(null);
        }}
        footer={null}
        width={800}
      >
        {loadingSession ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Carregando respostas...</Text>
            </div>
          </div>
        ) : sessionResponses ? (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Text type="secondary">
              Data: {new Date(sessionResponses.sessionDate).toLocaleString('pt-BR')}
            </Text>
            <Divider />
            {sessionResponses.responses.map((response: any, index: number) => (
              <Card key={index} size="small" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <Text strong style={{ fontSize: '16px' }}>
                    {index + 1}. {response.question}
                  </Text>
                  <Divider style={{ margin: '8px 0' }} />
                  {response.questionType === 'text_opinion' ? (
                    <Text>{response.textResponse || 'Sem resposta'}</Text>
                  ) : (
                    <Space>
                      <Text>Nota: </Text>
                      <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {response.scaleValue !== null ? response.scaleValue : 'Sem resposta'}
                        {response.scaleValue !== null &&
                          ` / ${response.questionType === 'scale_0_5' ? '5' : '10'}`}
                      </Tag>
                    </Space>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        ) : (
          <Empty description="Nenhuma resposta encontrada" />
        )}
      </Modal>
    </ResultsContainer>
  );
};

export default Results;

