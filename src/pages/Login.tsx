import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LogIn, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const { Title } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  position: relative;
  width: 100%;
  overflow-x: hidden;

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
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  
  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: 480px) {
    .ant-card-body {
      padding: 20px;
    }
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  gap: 12px;
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
            <Building2 size={32} color="#667eea" />
            <Title level={2} style={{ margin: 0 }}>
              Pesquisas
            </Title>
          </LogoContainer>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
            Sistema de Pesquisas de Satisfação
          </Title>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label="Login"
              name="login"
              rules={[{ required: true, message: 'Por favor, insira seu login!' }]}
            >
              <Input size="large" placeholder="Digite seu login" />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input.Password size="large" placeholder="Digite sua senha" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={<LogIn size={18} />}
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </LoginCard>
      </LoginContent>
      <Footer />
    </LoginContainer>
  );
};

export default Login;

