import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Typography,
  Space,
  Layout,
  Input,
  Select,
  Switch,
  message,
  Spin,
} from 'antd';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formsService } from '../services/api';
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

interface Form {
  id: string;
  question: string;
  question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
  order: number;
  is_optional: boolean;
}

const ViewEditSurvey: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const allForms = await formsService.getAll();
      // Ordenar por ordem
      const sortedForms = allForms.sort((a: Form, b: Form) => a.order - b.order);
      setForms(sortedForms);
    } catch (error: any) {
      message.error('Erro ao carregar formulário');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = (index: number, field: keyof Form, value: any) => {
    const updatedForms = [...forms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setForms(updatedForms);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Atualizar cada pergunta
      const updatePromises = forms.map((form, index) =>
        formsService.update(form.id, {
          question: form.question,
          question_type: form.question_type,
          order: index,
          is_optional: form.is_optional,
        })
      );

      await Promise.all(updatePromises);
      message.success('Formulário atualizado com sucesso!');
      setEditing(false);
      loadForms();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (formId: string) => {
    try {
      await formsService.delete(formId);
      message.success('Pergunta removida com sucesso');
      loadForms();
    } catch (error: any) {
      message.error('Erro ao remover pergunta');
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'scale_0_5':
        return 'Escala de 0 a 5';
      case 'scale_0_10':
        return 'Escala de 0 a 10';
      case 'text_opinion':
        return 'Texto/Opinião';
      default:
        return type;
    }
  };

  if (loading) {
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
        <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/surveys')}>
          Voltar
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          {editing ? 'Editar Formulário' : 'Visualizar Formulário'}
        </Title>
        <Space>
          {!editing ? (
            <Button type="primary" onClick={() => setEditing(true)}>
              Editar
            </Button>
          ) : (
            <Space>
              <Button onClick={() => {
                setEditing(false);
                loadForms();
              }}>
                Cancelar
              </Button>
              <Button
                type="primary"
                icon={<Save size={16} />}
                onClick={handleSave}
                loading={saving}
              >
                Salvar
              </Button>
            </Space>
          )}
        </Space>
      </StyledHeader>
      <StyledContent>
        {forms.length === 0 ? (
          <Card>
            <Text>Nenhuma pergunta encontrada neste formulário.</Text>
          </Card>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card style={{ borderRadius: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={3}>Formulário de Pesquisa</Title>
                <Text type="secondary">
                  {editing
                    ? 'Edite as perguntas abaixo. Clique em "Salvar" para confirmar as alterações.'
                    : 'Visualize as perguntas do formulário. Clique em "Editar" para fazer alterações.'}
                </Text>
                <Text>
                  <strong>Total de perguntas:</strong> {forms.length}
                </Text>
              </Space>
            </Card>

            {forms.map((form, index) => (
              <QuestionCard key={form.id}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong>Pergunta {index + 1}</Text>
                    {editing && (
                      <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(form.id)}
                      >
                        Remover
                      </Button>
                    )}
                  </Space>

                  {editing ? (
                    <>
                      <Input
                        placeholder="Digite a pergunta"
                        value={form.question}
                        onChange={(e) =>
                          handleUpdateQuestion(index, 'question', e.target.value)
                        }
                        size="large"
                      />

                      <Space style={{ width: '100%' }}>
                        <Select
                          value={form.question_type}
                          onChange={(value) =>
                            handleUpdateQuestion(index, 'question_type', value)
                          }
                          style={{ width: '100%' }}
                          disabled={form.question_type === 'text_opinion'}
                        >
                          <Option value="scale_0_5">Escala de 0 a 5</Option>
                          <Option value="scale_0_10">Escala de 0 a 10</Option>
                          <Option value="text_opinion">Texto/Opinião</Option>
                        </Select>

                        <Space>
                          <Text>Opcional:</Text>
                          <Switch
                            checked={form.is_optional}
                            onChange={(checked) =>
                              handleUpdateQuestion(index, 'is_optional', checked)
                            }
                          />
                        </Space>
                      </Space>
                    </>
                  ) : (
                    <>
                      <Text style={{ fontSize: '16px' }}>{form.question}</Text>
                      <Space>
                        <Text type="secondary">
                          Tipo: <strong>{getQuestionTypeLabel(form.question_type)}</strong>
                        </Text>
                        {form.is_optional && (
                          <Text type="secondary">• Opcional</Text>
                        )}
                      </Space>
                    </>
                  )}
                </Space>
              </QuestionCard>
            ))}
          </Space>
        )}
      </StyledContent>
      <Footer />
    </SurveyContainer>
  );
};

export default ViewEditSurvey;

