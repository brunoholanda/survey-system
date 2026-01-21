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
  Divider,
} from 'antd';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { formsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ShareLinkModal from '../components/ShareLinkModal';
import Footer from '../components/Footer';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Option } = Select;

const SurveyContainer = styled(Layout)`
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

const QuestionCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
`;

const AddQuestionCard = styled(Card)`
  margin-bottom: 16px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    background: #f5f5f5;
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
        <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Criar Nova Pesquisa
        </Title>
        <Button
          type="primary"
          icon={<Save size={16} />}
          onClick={handleSave}
          loading={loading}
        >
          Salvar Pesquisa
        </Button>
      </StyledHeader>
      <StyledContent>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Instruções</Title>
            <Text>
              • Adicione até 20 perguntas para sua pesquisa de satisfação
              <br />
              • Escolha o tipo de resposta: escala de 0 a 5 ou 0 a 10
              <br />
              • Você pode adicionar um campo opcional para opinião em texto
              <br />
              • Marque perguntas como opcionais se necessário
            </Text>
          </Space>
        </Card>

        {questions.map((question, index) => (
          <QuestionCard key={question.id}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text strong>Pergunta {index + 1}</Text>
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => removeQuestion(question.id)}
                >
                  Remover
                </Button>
              </Space>

              <Form.Item label="Pergunta" style={{ marginBottom: 16 }}>
                <Input
                  placeholder="Digite a pergunta"
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(question.id, 'question', e.target.value)
                  }
                />
              </Form.Item>

              <Space style={{ width: '100%' }}>
                <Form.Item label="Tipo de Resposta" style={{ flex: 1 }}>
                  <Select
                    value={question.question_type}
                    onChange={(value) =>
                      updateQuestion(question.id, 'question_type', value)
                    }
                    style={{ width: '100%' }}
                  >
                    <Option value="scale_0_5">Escala de 0 a 5</Option>
                    <Option value="scale_0_10">Escala de 0 a 10</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Opcional" style={{ marginLeft: 16 }}>
                  <Switch
                    checked={question.is_optional}
                    onChange={(checked) =>
                      updateQuestion(question.id, 'is_optional', checked)
                    }
                  />
                </Form.Item>
              </Space>
            </Space>
          </QuestionCard>
        ))}

        {questions.length < 20 && (
          <AddQuestionCard onClick={addQuestion}>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Plus size={32} color="#667eea" />
              <Text type="secondary">Adicionar Pergunta</Text>
            </Space>
          </AddQuestionCard>
        )}

        <Divider />

        <Card style={{ borderRadius: 8 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Title level={5}>Campo de Opinião</Title>
                <Text type="secondary">
                  Adicione um campo opcional para o cliente deixar sua opinião em texto
                </Text>
              </div>
              <Switch
                checked={hasOpinionField}
                onChange={setHasOpinionField}
              />
            </Space>
          </Space>
        </Card>

        {questions.length > 0 && (
          <Card style={{ marginTop: 24, borderRadius: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>
                Total de perguntas: {questions.length}
                {hasOpinionField && ' + campo de opinião'}
              </Text>
              <Text type="secondary">
                {questions.length < 20
                  ? `Você pode adicionar mais ${20 - questions.length} pergunta(s)`
                  : 'Limite máximo de perguntas atingido'}
              </Text>
            </Space>
          </Card>
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
        companyName={user?.company.name}
      />
    </SurveyContainer>
  );
};

export default CreateSurvey;

