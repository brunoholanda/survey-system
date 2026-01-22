import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LogIn, Building2, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const { Title, Text } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 16px;
  position: relative;
  width: 100%;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const LoginContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  padding: 16px 0;
  position: relative;
  z-index: 1;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  border: none;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
  
  .ant-card-body {
    padding: 40px 32px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    border-radius: 20px;
    
    .ant-card-body {
      padding: 32px 24px;
    }
  }

  @media (max-width: 360px) {
    .ant-card-body {
      padding: 24px 20px;
    }
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 16px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    border-radius: 18px;
  }
`;

const TitleWrapper = styled.div`
  text-align: center;
`;

const SubtitleText = styled(Text)`
  font-size: 15px;
  color: #8c8c8c;
  display: block;
  margin-top: 8px;
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const StyledForm = styled(Form<{ login: string; password: string }>)`
  .ant-form-item-label > label {
    font-weight: 600;
    color: #262626;
    font-size: 14px;
  }

  .ant-input-affix-wrapper,
  .ant-input {
    border-radius: 12px;
    border: 2px solid #e8e8e8;
    transition: all 0.3s ease;
    font-size: 15px;
    padding: 12px 16px;
    height: auto;

    &:hover {
      border-color: #667eea;
    }

    &:focus,
    &.ant-input-affix-wrapper-focused {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .ant-input-password-icon {
    color: #8c8c8c;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }
`;

const InputIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  color: #595959;
  font-weight: 600;
  font-size: 14px;
`;

const StyledButton = styled(Button)`
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &:disabled {
    background: #d9d9d9;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    height: 44px;
    font-size: 15px;
  }
`;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.login, values.password);
      message.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      // Error já é tratado no contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginContent>
        <LoginCard>
          <LogoContainer>
            <IconWrapper>
              <Building2 size={40} color="#ffffff" strokeWidth={2.5} />
            </IconWrapper>
            <TitleWrapper>
              <Title level={2} style={{ margin: 0, fontSize: '32px', fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Sistema de Pesquisas
              </Title>
              <SubtitleText>
                Acesse sua conta para continuar
              </SubtitleText>
            </TitleWrapper>
          </LogoContainer>
          <StyledForm
            name="login"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="login"
              rules={[{ required: true, message: 'Por favor, insira seu login!' }]}
            >
              <div>
                <InputIconWrapper>
                  <User size={18} />
                  <span>Login</span>
                </InputIconWrapper>
                <Input 
                  placeholder="Digite seu login" 
                  prefix={<User size={18} style={{ color: '#bfbfbf' }} />}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <div>
                <InputIconWrapper>
                  <Lock size={18} />
                  <span>Senha</span>
                </InputIconWrapper>
                <Input.Password 
                  placeholder="Digite sua senha"
                  prefix={<Lock size={18} style={{ color: '#bfbfbf' }} />}
                />
              </div>
            </Form.Item>

            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <StyledButton
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                icon={<LogIn size={20} />}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </StyledButton>
            </Form.Item>
          </StyledForm>
        </LoginCard>
      </LoginContent>
      <Footer />
    </LoginContainer>
  );
};

export default Login;

