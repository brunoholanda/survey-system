import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Typography,
  Space,
  Layout,
  Input,
  Button,
  Slider,
  message,
  Spin,
  Tag,
  Avatar,
} from 'antd';
import { CheckCircle, Building2, Shield, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { publicFormsService, publicSurveysService, publicCompaniesService } from '../services/publicApi';
import FooterComponent from '../components/Footer';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

const SurveyContainer = styled(Layout)`
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #E8F4F8 0%, #B8E6E6 50%, #D4F1F4 100%);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  @media (orientation: portrait) {
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
`;

const StyledHeader = styled(Header)`
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  min-height: auto;
  height: auto;
  line-height: normal;

  @media (orientation: portrait) and (min-width: 768px) {
    padding: 32px 24px;
  }
`;

const StyledFooter = styled(Footer)`
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px 16px;
  margin-top: auto;

  @media (orientation: portrait) and (min-width: 768px) {
    padding: 24px;
  }
`;

const StyledContent = styled(Content)`
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const QuestionWrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  width: 100%;
  max-width: 100%;

  @media (orientation: portrait) and (min-width: 768px) {
    padding: 24px 32px;
    max-width: 900px;
    margin: 0 auto;
  }

  @media (orientation: portrait) and (min-width: 1024px) {
    padding: 28px 40px;
    max-width: 1000px;
  }
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: white;
  border: none;

  @media (orientation: portrait) and (min-width: 768px) {
    margin-bottom: 32px;
    padding: 32px;
  }
`;

const QuestionCard = styled(Card)`
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: white;
  border: none;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;

  .ant-card-body {
    padding: 24px !important;
  }

  @media (orientation: portrait) and (min-width: 768px) {
    max-width: 900px;
    .ant-card-body {
      padding: 32px !important;
    }
  }

  @media (orientation: portrait) and (min-width: 1024px) {
    max-width: 1000px;
    .ant-card-body {
      padding: 36px !important;
    }
  }
`;

const SuccessCard = styled(Card)`
  text-align: center;
  border-radius: 24px;
  background: linear-gradient(135deg, #0066CC 0%, #00A86B 100%);
  color: white;
  border: none;
  padding: 48px 24px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (orientation: portrait) and (min-width: 768px) {
    padding: 64px 32px;
    min-height: 500px;
  }
`;

const CompanyName = styled(Title)`
  margin: 0 !important;
  font-size: 28px !important;
  font-weight: 700 !important;
  color: #0066CC;

  @media (orientation: portrait) and (min-width: 768px) {
    font-size: 36px !important;
  }
`;

const QuestionNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0066CC 0%, #00A86B 100%);
  color: white;
  font-weight: 700;
  font-size: 18px;
  margin-right: 12px;

  @media (orientation: portrait) and (min-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
    margin-right: 16px;
  }
`;

const ScaleContainer = styled.div`
  padding: 24px 0;

  @media (orientation: portrait) and (min-width: 768px) {
    padding: 32px 0;
  }

  @media (orientation: portrait) and (min-width: 1024px) {
    padding: 40px 0;
  }
`;

const ScaleButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (orientation: portrait) and (min-width: 768px) {
    gap: 12px;
    margin-bottom: 32px;
  }
`;

const ScaleButton = styled.button<{ selected: boolean; maxValue: number }>`
  flex: 1;
  min-width: ${props => props.maxValue === 5 ? '50px' : '40px'};
  height: 60px;
  border: 3px solid ${props => props.selected ? '#0066CC' : '#B8E6E6'};
  border-radius: 12px;
  background: ${props => props.selected
    ? 'linear-gradient(135deg, #0066CC 0%, #00A86B 100%)'
    : '#FFFFFF'};
  color: ${props => props.selected ? '#FFFFFF' : '#0066CC'};
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.selected
    ? '0 4px 12px rgba(0, 102, 204, 0.4)'
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  @media (min-width: 768px) {
    min-width: ${props => props.maxValue === 5 ? '60px' : '50px'};
    height: 70px;
    font-size: 24px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    min-width: ${props => props.maxValue === 5 ? '45px' : '35px'};
    height: 55px;
    font-size: 18px;
    border-width: 2px;
  }

  @media (min-width: 768px) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.selected
        ? '0 6px 16px rgba(0, 102, 204, 0.5)'
        : '0 4px 8px rgba(0, 0, 0, 0.15)'};
      border-color: #0066CC;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SliderContainer = styled.div`
  margin-top: 32px;
  padding: 0 8px;
`;

const ScaleValueDisplay = styled.div`
  text-align: center;
  margin-top: 16px;
  padding: 12px;
  background: #E8F4F8;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #0066CC;
  border: 2px solid #B8E6E6;

  @media (orientation: portrait) and (min-width: 768px) {
    font-size: 24px;
    padding: 16px;
    margin-top: 20px;
  }
`;

const SubmitButton = styled(Button)`
  height: 56px !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #0066CC 0%, #00A86B 100%) !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(0, 102, 204, 0.4) !important;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  width: 100% !important;

  @media (min-width: 768px) {
    height: 64px !important;
    font-size: 20px !important;
    border-radius: 16px !important;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 102, 204, 0.5) !important;
      background: linear-gradient(135deg, #0052CC 0%, #00995C 100%) !important;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const AnonymityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #E8F4F8;
  border: 2px solid #0066CC;
  border-radius: 20px;
  color: #0066CC;
  font-size: 14px;
  font-weight: 500;

  @media (orientation: portrait) and (min-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }
`;

interface Form {
  id: string;
  question: string;
  question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
  order: number;
  is_optional: boolean;
}

interface Answer {
  form_id: string;
  scale_value?: number;
  text_response?: string;
}

interface Company {
  id: string;
  name: string;
  description?: string;
  logo_path?: string;
}

// Componente para exibir logo ou ícone padrão
const CompanyLogo: React.FC<{ company: Company | null; size?: number; color?: string }> = ({
  company,
  size = 32,
  color = "#0066CC"
}) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  if (company?.logo_path) {
    const logoUrl = company.logo_path.startsWith('http')
      ? company.logo_path
      : `${API_URL}${company.logo_path}`;

    return (
      <Avatar
        src={logoUrl}
        icon={<Building2 size={size} color={color} />}
        size={size}
        style={{ backgroundColor: 'transparent' }}
      />
    );
  }

  return <Building2 size={size} color={color} />;
};

const PublicSurvey: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [forms, setForms] = useState<Form[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (companyId) {
      loadData();
    }
  }, [companyId]);

  // Redirecionar para início da pesquisa após 5 segundos quando submitted for true
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        // Resetar estado para voltar ao início
        setSubmitted(false);
        setCurrentQuestionIndex(0);
        setAnswers(() => {
          const initialAnswers: { [key: string]: Answer } = {};
          forms.forEach((form: Form) => {
            initialAnswers[form.id] = {
              form_id: form.id,
            };
          });
          return initialAnswers;
        });
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitted, forms]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar empresa e formulários em paralelo
      const [companyData, formsData] = await Promise.all([
        publicCompaniesService.getById(companyId!),
        publicFormsService.getByCompanyId(companyId!),
      ]);

      setCompany(companyData);
      const sortedForms = formsData.sort((a: Form, b: Form) => a.order - b.order);
      setForms(sortedForms);

      // Inicializar respostas
      const initialAnswers: { [key: string]: Answer } = {};
      sortedForms.forEach((form: Form) => {
        initialAnswers[form.id] = {
          form_id: form.id,
        };
      });
      setAnswers(initialAnswers);
    } catch (error: any) {
      message.error('Erro ao carregar pesquisa. Verifique se o link está correto.');
    } finally {
      setLoading(false);
    }
  };

  const handleScaleChange = (formId: string, value: number) => {
    setAnswers({
      ...answers,
      [formId]: {
        ...answers[formId],
        form_id: formId,
        scale_value: value,
      },
    });

    // Scroll automático para próxima pergunta após responder
    setTimeout(() => {
      const currentForm = forms.find((f) => f.id === formId);
      if (currentForm) {
        const currentIndex = forms.findIndex((f) => f.id === formId);
        if (currentIndex < forms.length - 1) {
          scrollToNextQuestion(currentIndex + 2);
        }
      }
    }, 500);
  };

  const handleTextChange = (formId: string, value: string) => {
    setAnswers({
      ...answers,
      [formId]: {
        ...answers[formId],
        form_id: formId,
        text_response: value,
      },
    });
  };

  const scrollToNextQuestion = (nextIndex: number) => {
    if (nextIndex <= forms.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        if (questionRefs.current[nextIndex - 1]) {
          questionRefs.current[nextIndex - 1]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  };

  const isQuestionAnswered = (form: Form): boolean => {
    const answer = answers[form.id];
    if (!answer) return false;

    if (form.is_optional) {
      // Opcionais podem estar vazios
      return true;
    }

    if (form.question_type === 'text_opinion') {
      return answer.text_response !== undefined && answer.text_response.trim() !== '';
    } else {
      return answer.scale_value !== undefined && answer.scale_value !== null;
    }
  };

  const handleSubmit = async () => {
    // Validar respostas obrigatórias
    const requiredForms = forms.filter((f) => !f.is_optional);
    const missingAnswers = requiredForms.filter((form) => {
      const answer = answers[form.id];
      if (form.question_type === 'text_opinion') {
        return !answer?.text_response || answer.text_response.trim() === '';
      } else {
        return answer?.scale_value === undefined || answer.scale_value === null;
      }
    });

    if (missingAnswers.length > 0) {
      message.warning('Por favor, responda todas as perguntas obrigatórias.');
      return;
    }

    try {
      setSubmitting(true);
      const surveysToSubmit = Object.values(answers).filter((answer) => {
        const form = forms.find((f) => f.id === answer.form_id);
        if (!form) return false;
        if (form.is_optional) {
          return form.question_type === 'text_opinion'
            ? answer.text_response && answer.text_response.trim() !== ''
            : answer.scale_value !== undefined && answer.scale_value !== null;
        }
        return true;
      });

      await publicSurveysService.createMultiple(surveysToSubmit);
      setSubmitted(true);
      message.success('Obrigado por responder nossa pesquisa!');
    } catch (error: any) {
      message.error('Erro ao enviar respostas. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SurveyContainer>
        <Header style={{ background: 'transparent', height: 'auto', padding: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <CompanyLogo company={company} size={40} color="white" />
          </div>
        </Header>
        <StyledContent>
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Spin size="large" style={{ color: 'white' }} />
            <div style={{ marginTop: '24px' }}>
              <Text style={{ color: 'white', fontSize: '18px' }}>Carregando pesquisa...</Text>
            </div>
          </div>
        </StyledContent>
        <Footer style={{ background: 'transparent', color: 'white', textAlign: 'center' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Pesquisa de Satisfação</Text>
        </Footer>
      </SurveyContainer>
    );
  }

  if (forms.length === 0) {
    return (
      <SurveyContainer>
        <StyledHeader>
          <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
            <CompanyLogo company={company} size={32} color="#667eea" />
            {company && <CompanyName level={2}>{company.name}</CompanyName>}
          </Space>
        </StyledHeader>
        <StyledContent>
          <Card style={{ borderRadius: 16 }}>
            <Text style={{ fontSize: '18px' }}>Pesquisa não encontrada ou não disponível.</Text>
          </Card>
        </StyledContent>
        <StyledFooter>
          <Text type="secondary">Pesquisa de Satisfação</Text>
        </StyledFooter>
        <FooterComponent />
      </SurveyContainer>
    );
  }

  if (submitted) {
    return (
      <SurveyContainer>
        <StyledHeader>
          <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
            <CompanyLogo company={company} size={32} color="#667eea" />
            {company && <CompanyName level={2}>{company.name}</CompanyName>}
          </Space>
        </StyledHeader>
        <StyledContent>
          <SuccessCard>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <CheckCircle size={80} color="white" />
              <Title level={1} style={{ color: 'white', margin: 0, fontSize: '48px' }}>
                Obrigado!
              </Title>
              <Text style={{ color: 'white', fontSize: '20px', maxWidth: '400px' }}>
                Sua resposta foi registrada com sucesso.
              </Text>
              {company && (
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                  Agradecemos sua participação!
                </Text>
              )}
            </Space>
          </SuccessCard>
        </StyledContent>
        <StyledFooter>
          <Text type="secondary">Obrigado por sua participação!</Text>
        </StyledFooter>
        <FooterComponent />
      </SurveyContainer>
    );
  }

  return (
    <SurveyContainer>
      <StyledHeader>
        <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
          <Space>
            <CompanyLogo company={company} size={32} color="#0066CC" />
            {company && <CompanyName level={2}>{company.name}</CompanyName>}
          </Space>
          <AnonymityBadge>
            <Shield size={18} />
            <Text strong style={{ color: '#0066CC' }}>Esta pesquisa é totalmente anônima</Text>
          </AnonymityBadge>
        </Space>
      </StyledHeader>
      <StyledContent style={{ overflowY: 'auto', scrollBehavior: 'smooth', height: '100%' }}>
        {currentQuestionIndex === 0 && (
          <QuestionWrapper>
            <WelcomeCard>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space align="center">
                  <Star size={28} color="#0066CC" />
                  <Title level={2} style={{ margin: 0, fontSize: '28px', color: '#0066CC' }}>
                    Pesquisa de Satisfação
                  </Title>
                </Space>
                <Text style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  Sua opinião é muito importante para nós. Por favor, responda as perguntas abaixo com sinceridade.
                </Text>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setCurrentQuestionIndex(1);
                    setTimeout(() => {
                      questionRefs.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  style={{
                    marginTop: '16px',
                    height: '50px',
                    fontSize: '18px',
                    background: 'linear-gradient(135deg, #0066CC 0%, #00A86B 100%)',
                    border: 'none',
                  }}
                >
                  Começar Pesquisa
                </Button>
              </Space>
            </WelcomeCard>
          </QuestionWrapper>
        )}

        {forms.map((form, index) => {
          const answer = answers[form.id] || { form_id: form.id };
          const isTextOpinion = form.question_type === 'text_opinion';
          const maxValue = form.question_type === 'scale_0_5' ? 5 : 10;
          const isAnswered = isQuestionAnswered(form);
          // Mostrar pergunta se já foi alcançada (currentQuestionIndex >= index + 1)
          const showQuestion = currentQuestionIndex >= index + 1;

          if (!showQuestion) return null;

          return (
            <QuestionWrapper
              key={form.id}
              ref={(el) => {
                questionRefs.current[index] = el;
              }}
            >
              <QuestionCard>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Space align="start" style={{ width: '100%' }}>
                    <QuestionNumber>{index + 1}</QuestionNumber>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: '20px', lineHeight: '1.6' }}>
                        {form.question}
                      </Text>
                      {form.is_optional && (
                        <Tag color="default" style={{ marginLeft: '8px', fontSize: '12px' }}>
                          Opcional
                        </Tag>
                      )}
                    </div>
                  </Space>

                  {isTextOpinion ? (
                    <>
                      <TextArea
                        rows={8}
                        placeholder="Digite sua opinião aqui..."
                        value={answer.text_response || ''}
                        onChange={(e) => handleTextChange(form.id, e.target.value)}
                        disabled={submitting}
                        style={{
                          fontSize: '18px',
                          borderRadius: '12px',
                          padding: '16px',
                        }}
                      />
                      {isAnswered && index < forms.length - 1 && (
                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={() => scrollToNextQuestion(index + 2)}
                          style={{
                            marginTop: '16px',
                            height: '56px',
                            fontSize: '18px',
                            background: 'linear-gradient(135deg, #0066CC 0%, #00A86B 100%)',
                            border: 'none',
                          }}
                        >
                          Próxima Pergunta →
                        </Button>
                      )}
                    </>
                  ) : (
                    <ScaleContainer>
                      {/* Botões de escala */}
                      <ScaleButtonsContainer>
                        {Array.from({ length: maxValue + 1 }, (_, i) => (
                          <ScaleButton
                            key={i}
                            selected={answer.scale_value === i}
                            maxValue={maxValue}
                            onClick={() => handleScaleChange(form.id, i)}
                            disabled={submitting}
                            type="button"
                          >
                            {i}
                          </ScaleButton>
                        ))}
                      </ScaleButtonsContainer>

                      {/* Slider adicional para ajuste fino */}
                      <SliderContainer>
                        <Slider
                          min={0}
                          max={maxValue}
                          value={answer.scale_value}
                          onChange={(value) => handleScaleChange(form.id, value)}
                          disabled={submitting}
                          tooltip={{ open: false }}
                          style={{ marginBottom: '8px' }}
                          trackStyle={{ height: '8px', background: 'linear-gradient(90deg, #0066CC 0%, #00A86B 100%)' }}
                          railStyle={{ background: '#E8F4F8', height: '8px' }}
                          handleStyle={{
                            width: '24px',
                            height: '24px',
                            border: '3px solid #FFFFFF',
                            background: '#0066CC',
                            boxShadow: '0 2px 8px rgba(0, 102, 204, 0.4)',
                            borderRadius: '50%',
                            marginTop: '-8px',
                          }}
                        />
                      </SliderContainer>

                      {/* Display da nota selecionada */}
                      <ScaleValueDisplay>
                        <Text style={{ fontSize: '18px', color: '#666', marginRight: '8px' }}>
                          Sua avaliação:
                        </Text>
                        <Text strong style={{ fontSize: '28px', color: '#0066CC' }}>
                          {answer.scale_value ?? 0} / {maxValue}
                        </Text>
                      </ScaleValueDisplay>
                    </ScaleContainer>
                  )}

                  {index === forms.length - 1 && isAnswered && (
                    <Card style={{ borderRadius: 16, marginTop: '24px', background: '#E8F4F8' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <SubmitButton
                          type="primary"
                          block
                          onClick={handleSubmit}
                          loading={submitting}
                        >
                          {submitting ? 'Enviando...' : 'Enviar Respostas'}
                        </SubmitButton>
                        <Text type="secondary" style={{ textAlign: 'center', display: 'block', fontSize: '14px' }}>
                          Obrigado por responder todas as perguntas!
                        </Text>
                      </Space>
                    </Card>
                  )}
                </Space>
              </QuestionCard>
            </QuestionWrapper>
          );
        })}
      </StyledContent>
      <StyledFooter>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Sua opinião é muito importante para nós. Obrigado por participar!
        </Text>
      </StyledFooter>
      <FooterComponent />
    </SurveyContainer>
  );
};

export default PublicSurvey;
