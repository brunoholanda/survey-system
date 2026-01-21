import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Typography,
  Space,
  Layout,
  List,
  Tag,
  Empty,
  Spin,
  message,
} from 'antd';
import { ArrowLeft, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { formsService } from '../services/api';
import Footer from '../components/Footer';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const SurveysContainer = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const StyledContent = styled(Content)`
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SurveyCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

interface Form {
  id: string;
  question: string;
  question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
  order: number;
  is_optional: boolean;
  created_at: string;
}

const ListSurveys: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    // Se houver formulários, redirecionar para o primeiro
    if (forms.length > 0 && !loading) {
      navigate(`/surveys/${forms[0].id}`, { replace: true });
    }
  }, [forms.length, loading]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await formsService.getAll();
      // Agrupar por ordem para mostrar como um formulário completo
      setForms(data.sort((a: Form, b: Form) => a.order - b.order));
    } catch (error: any) {
      message.error('Erro ao carregar formulários');
    } finally {
      setLoading(false);
    }
  };


  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'scale_0_5':
        return 'Escala 0-5';
      case 'scale_0_10':
        return 'Escala 0-10';
      case 'text_opinion':
        return 'Texto/Opinião';
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'scale_0_5':
        return 'blue';
      case 'scale_0_10':
        return 'green';
      case 'text_opinion':
        return 'orange';
      default:
        return 'default';
    }
  };

  // Como todas as perguntas pertencem à mesma empresa, vamos mostrar como um único formulário
  // Agrupando por ordem sequencial (perguntas criadas juntas terão ordem próxima)
  const formGroups = forms.length > 0 ? [forms] : [];

  return (
    <SurveysContainer>
      <StyledHeader>
        <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Formulários de Pesquisa
        </Title>
        <div />
      </StyledHeader>
      <StyledContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : forms.length === 0 ? (
          <Empty
            description="Nenhum formulário encontrado"
            style={{ marginTop: '48px' }}
          >
            <Button type="primary" onClick={() => navigate('/create-survey')}>
              Criar Primeira Pesquisa
            </Button>
          </Empty>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {formGroups.map((group, groupIndex) => (
              <Card
                key={groupIndex}
                title={
                  <Space>
                    <Title level={4} style={{ margin: 0 }}>
                      Meu Formulário de Pesquisa
                    </Title>
                    <Tag color="blue">{group.length} pergunta(s)</Tag>
                  </Space>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<Eye size={16} />}
                    onClick={() => navigate(`/surveys/${group[0].id}`)}
                  >
                    Ver/Editar
                  </Button>
                }
                style={{ borderRadius: 8 }}
              >
                <List
                  dataSource={group}
                  renderItem={(form, index) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>
                              {index + 1}. {form.question}
                            </Text>
                            <Tag color={getQuestionTypeColor(form.question_type)}>
                              {getQuestionTypeLabel(form.question_type)}
                            </Tag>
                            {form.is_optional && <Tag color="default">Opcional</Tag>}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            ))}
          </Space>
        )}
      </StyledContent>
      <Footer />
    </SurveysContainer>
  );
};

export default ListSurveys;

