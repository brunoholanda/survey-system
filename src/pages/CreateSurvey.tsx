import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Select,
  Switch,
  message,
  Layout,
  Spin,
} from 'antd';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Lightbulb, 
  FileText, 
  GripVertical,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  BarChart3,
  Settings,
  Eye,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { formsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ShareLinkModal from '../components/ShareLinkModal';
import Footer from '../components/Footer';
import QuestionSuggestions from '../components/QuestionSuggestions';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Option } = Select;

const SurveyContainer = styled(Layout)`
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
`;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 72px;
  height: auto;

  @media (min-width: 768px) {
    padding: 20px 24px;
    min-height: 80px;
    flex-wrap: nowrap;
  }

  .ant-typography {
    font-size: 18px;
    
    @media (max-width: 480px) {
      font-size: 16px;
    }
  }

  .ant-btn {
    @media (max-width: 480px) {
      font-size: 13px;
      padding: 4px 12px;
      height: auto;
    }
  }
`;

const StyledContent = styled(Content)`
  padding: 24px 16px;
  padding-top: 104px; /* Espaço para o header fixo */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 48px 24px;
    padding-top: 120px; /* Espaço maior para header em telas maiores */
  }

  @media (min-width: 1024px) {
    padding: 48px;
    padding-top: 120px;
  }
`;

const QuestionCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 12px;
  width: 100%;
  border: 1px solid #e8e8e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }
  }

  .ant-card-body {
    padding: 20px;

    @media (min-width: 768px) {
      padding: 28px;
    }
  }

  .ant-space {
    width: 100%;
  }

  .ant-input,
  .ant-select {
    width: 100% !important;
  }
`;

const AddQuestionCard = styled(Card)`
  margin-bottom: 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);

  &:hover {
    border-color: #667eea;
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  }

  @media (max-width: 768px) {
    &:hover {
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    }
    
    &:active {
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
      transform: scale(0.98);
    }
  }

  .ant-card-body {
    padding: 32px 20px;

    @media (min-width: 768px) {
      padding: 48px 32px;
    }
  }
`;

const QuestionNumberBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`;

const InfoCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
  border: 1px solid #d6e4ff;

  .ant-card-body {
    padding: 20px;

    @media (min-width: 768px) {
      padding: 24px;
    }
  }
`;

const StatsCard = styled(Card)`
  margin-top: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
  border: 1px solid #e8e8e8;

  .ant-card-body {
    padding: 20px;

    @media (min-width: 768px) {
      padding: 24px;
    }
  }
`;

const OpinionCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
  }

  .ant-card-body {
    padding: 20px;

    @media (min-width: 768px) {
      padding: 24px;
    }
  }
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: #fafafa;
  }
`;

interface Question {
  id: string;
  question: string;
  question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
  is_optional: boolean;
}

const CreateSurvey: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasOpinionField, setHasOpinionField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    checkFormExists();
  }, []);

  const checkFormExists = async () => {
    try {
      const exists = await formsService.checkFormExists();
      if (exists) {
        message.warning('Você já possui um formulário. Redirecionando para edição...');
        const forms = await formsService.getAll();
        if (forms.length > 0) {
          navigate(`/surveys/${forms[0].id}`);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar formulário:', error);
    } finally {
      setChecking(false);
    }
  };

  const addQuestion = () => {
    if (questions.length >= 20) {
      message.warning('Máximo de 20 perguntas permitidas');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      question_type: 'scale_0_10',
      is_optional: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = async () => {
    // Validar perguntas
    const validQuestions = questions.filter((q) => q.question.trim() !== '');

    if (validQuestions.length === 0) {
      message.error('Adicione pelo menos uma pergunta');
      return;
    }

    // Adicionar campo de opinião se necessário
    const formsToSave = [...validQuestions];

    if (hasOpinionField) {
      formsToSave.push({
        id: 'opinion',
        question: 'Deixe sua opinião',
        question_type: 'text_opinion',
        is_optional: true,
      });
    }

    setLoading(true);
    try {
      const forms = formsToSave.map((q, index) => ({
        question: q.question,
        question_type: q.question_type,
        order: index,
        is_optional: q.is_optional,
      }));

      await formsService.createMultiple(forms);
      message.success('Pesquisa criada com sucesso!');
      // Mostrar modal com link público
      setShowShareModal(true);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao criar pesquisa');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <SurveyContainer>
        <StyledContent>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        </StyledContent>
      </SurveyContainer>
    );
  }

  return (
    <SurveyContainer>
      <StyledHeader>
        <Button 
          icon={<ArrowLeft size={16} />} 
          onClick={() => navigate('/dashboard')}
          style={{ borderRadius: '8px' }}
        >
          Voltar
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}>
            <FileText size={20} color="white" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Criar Nova Pesquisa
          </Title>
        </div>
        <Button
          type="primary"
          icon={<Save size={16} />}
          onClick={handleSave}
          loading={loading}
          style={{
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            height: '40px',
            padding: '0 24px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}
        >
          Salvar Pesquisa
        </Button>
      </StyledHeader>
      <StyledContent>
        <InfoCard>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconWrapper>
                <Sparkles size={20} />
              </IconWrapper>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Guia de Criação
                  <Info size={16} color="#667eea" />
                </Title>
                <Text type="secondary" style={{ fontSize: '13px', marginTop: 4, display: 'block' }}>
                  Crie uma pesquisa profissional em minutos
                </Text>
              </div>
            </div>
            
            <FeatureList>
              <FeatureItem>
                <CheckCircle2 size={16} color="#52c41a" />
                <span>Até 20 perguntas</span>
              </FeatureItem>
              <FeatureItem>
                <BarChart3 size={16} color="#667eea" />
                <span>Escalas 0-5 ou 0-10</span>
              </FeatureItem>
              <FeatureItem>
                <MessageSquare size={16} color="#764ba2" />
                <span>Campo de opinião</span>
              </FeatureItem>
              <FeatureItem>
                <Settings size={16} color="#faad14" />
                <span>Perguntas opcionais</span>
              </FeatureItem>
            </FeatureList>

            <Button
              type="default"
              icon={<Lightbulb size={16} />}
              onClick={() => setShowSuggestions(!showSuggestions)}
              style={{ 
                width: '100%',
                height: '48px',
                borderRadius: '10px',
                border: '1px solid #667eea',
                background: showSuggestions ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                color: showSuggestions ? 'white' : '#667eea',
                fontWeight: 500,
                transition: 'all 0.3s'
              }}
              block
            >
              {showSuggestions ? (
                <Space>
                  <Eye size={16} />
                  <span>Ocultar Perguntas Sugeridas</span>
                </Space>
              ) : (
                <Space>
                  <Sparkles size={16} />
                  <span>Usar Perguntas Sugeridas</span>
                </Space>
              )}
            </Button>
          </Space>
        </InfoCard>

        <QuestionSuggestions
          visible={showSuggestions}
          onAddQuestion={(suggestion) => {
            if (questions.length >= 20) {
              return;
            }
            const newQuestion: Question = {
              id: Date.now().toString(),
              question: suggestion.question,
              question_type: suggestion.question_type,
              is_optional: suggestion.is_optional,
            };
            setQuestions([...questions, newQuestion]);
          }}
          currentQuestionsCount={questions.length}
          maxQuestions={20}
        />

        {questions.map((question, index) => (
          <QuestionCard key={question.id}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space style={{ alignItems: 'center' }}>
                  <GripVertical size={18} color="#999" style={{ cursor: 'grab' }} />
                  <QuestionNumberBadge>{index + 1}</QuestionNumberBadge>
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>Pergunta {index + 1}</Text>
                    {question.is_optional && (
                      <span style={{ 
                        marginLeft: 8, 
                        padding: '2px 8px', 
                        background: '#fff7e6', 
                        color: '#faad14', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        Opcional
                      </span>
                    )}
                  </div>
                </Space>
                <Button
                  danger
                  type="text"
                  icon={<Trash2 size={16} />}
                  onClick={() => removeQuestion(question.id)}
                  style={{ 
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  Remover
                </Button>
              </Space>

              <Form.Item 
                label={
                  <Space>
                    <FileText size={16} color="#667eea" />
                    <span style={{ fontWeight: 500 }}>Texto da Pergunta</span>
                  </Space>
                } 
                style={{ marginBottom: 20 }}
              >
                <Input
                  placeholder="Ex: Como você avalia nosso atendimento?"
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(question.id, 'question', e.target.value)
                  }
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Space style={{ width: '100%' }} direction="vertical" size="middle">
                <Form.Item 
                  label={
                    <Space>
                      <BarChart3 size={16} color="#667eea" />
                      <span style={{ fontWeight: 500 }}>Tipo de Resposta</span>
                    </Space>
                  } 
                  style={{ width: '100%', marginBottom: 0 }}
                >
                  <Select
                    value={question.question_type}
                    onChange={(value) =>
                      updateQuestion(question.id, 'question_type', value)
                    }
                    style={{ width: '100%', borderRadius: '8px' }}
                    size="large"
                  >
                    <Option value="scale_0_5">
                      <Space>
                        <BarChart3 size={14} />
                        <span>Escala de 0 a 5</span>
                      </Space>
                    </Option>
                    <Option value="scale_0_10">
                      <Space>
                        <BarChart3 size={14} />
                        <span>Escala de 0 a 10</span>
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  label={
                    <Space>
                      <Settings size={16} color="#667eea" />
                      <span style={{ fontWeight: 500 }}>Configurações</span>
                    </Space>
                  } 
                  style={{ width: '100%', marginBottom: 0 }}
                >
                  <Space>
                    <Text>Pergunta opcional:</Text>
                    <Switch
                      checked={question.is_optional}
                      onChange={(checked) =>
                        updateQuestion(question.id, 'is_optional', checked)
                      }
                    />
                  </Space>
                </Form.Item>
              </Space>
            </Space>
          </QuestionCard>
        ))}

        {questions.length < 20 && (
          <AddQuestionCard onClick={addQuestion}>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                marginBottom: 12
              }}>
                <Plus size={32} color="white" />
              </div>
              <Text strong style={{ fontSize: '16px', color: '#667eea' }}>
                Adicionar Nova Pergunta
              </Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Clique para adicionar mais uma pergunta à sua pesquisa
              </Text>
            </Space>
          </AddQuestionCard>
        )}

        <OpinionCard>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Space style={{ marginBottom: 8 }}>
                  <MessageSquare size={20} color="#667eea" />
                  <Title level={5} style={{ margin: 0 }}>Campo de Opinião Livre</Title>
                </Space>
                <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
                  Adicione um campo opcional para o cliente deixar sua opinião em texto livre.
                  Isso permite feedbacks mais detalhados e personalizados.
                </Text>
              </div>
              <Switch
                checked={hasOpinionField}
                onChange={setHasOpinionField}
                size="default"
              />
            </Space>
            {hasOpinionField && (
              <div style={{
                padding: '12px 16px',
                background: '#f0f4ff',
                borderRadius: '8px',
                border: '1px solid #d6e4ff',
                marginTop: 8
              }}>
                <Space>
                  <CheckCircle2 size={16} color="#52c41a" />
                  <Text style={{ fontSize: '13px', color: '#52c41a' }}>
                    Campo de opinião será adicionado ao final da pesquisa
                  </Text>
                </Space>
              </div>
            )}
          </Space>
        </OpinionCard>

        {questions.length > 0 && (
          <StatsCard>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}>
                    <FileText size={20} color="white" />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: '18px', display: 'block' }}>
                      {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}
                      {hasOpinionField && ' + campo de opinião'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {questions.length < 20
                        ? `Você pode adicionar mais ${20 - questions.length} pergunta(s)`
                        : 'Limite máximo de perguntas atingido'}
                    </Text>
                  </div>
                </Space>
                {questions.length >= 20 && (
                  <div style={{
                    padding: '8px 12px',
                    background: '#fff7e6',
                    borderRadius: '8px',
                    border: '1px solid #ffe58f'
                  }}>
                    <Space>
                      <AlertCircle size={16} color="#faad14" />
                      <Text style={{ fontSize: '13px', color: '#faad14' }}>
                        Limite atingido
                      </Text>
                    </Space>
                  </div>
                )}
              </div>
            </Space>
          </StatsCard>
        )}
      </StyledContent>
      <Footer />
      <ShareLinkModal
        open={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          navigate('/dashboard');
          window.location.reload();
        }}
        companyId={user?.company_id || ''}
        companyName={user?.company?.name}
      />
    </SurveyContainer>
  );
};

export default CreateSurvey;

