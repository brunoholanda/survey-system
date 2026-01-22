import { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Layout, Spin } from 'antd';
import { Plus, LogOut, Building2, FileEdit, Share2, User, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { formsService } from '../services/api';
import ShareLinkModal from '../components/ShareLinkModal';
import EditProfileModal from '../components/EditProfileModal';
import Footer from '../components/Footer';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const DashboardContainer = styled(Layout)`
  min-height: 100vh;
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
`;

const StyledContent = styled(Content)`
  padding: 24px 16px;
  padding-top: 104px; /* Espaço para o header fixo */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 48px 24px;
    padding-top: 120px; /* Espaço para o header fixo */
  }

  @media (min-width: 1024px) {
    padding: 48px;
    padding-top: 120px;
  }
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 32px;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);

  .ant-card-body {
    padding: 32px 24px;

    @media (min-width: 768px) {
      padding: 40px 32px;
    }
  }
`;

const ActionCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  border: 2px solid #f0f0f0;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: scale(0.98);
    }
  }

  .ant-card-body {
    padding: 32px 24px;

    @media (min-width: 768px) {
      padding: 40px 32px;
    }
  }
`;

const ShareButton = styled(Button)`
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, #389e0d 0%, #52c41a 100%);
    box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 4px 12px;
    height: auto;
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hasForm, setHasForm] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    checkFormExists();
  }, []);

  // Recarregar quando a página receber foco (após criar formulário)
  useEffect(() => {
    const handleFocus = () => {
      checkFormExists();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const checkFormExists = async () => {
    try {
      const exists = await formsService.checkFormExists();
      setHasForm(exists);
    } catch (error) {
      console.error('Erro ao verificar formulário:', error);
      setHasForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewEdit = async () => {
    try {
      const forms = await formsService.getAll();
      if (forms.length > 0) {
        navigate(`/surveys/${forms[0].id}`);
      } else {
        navigate('/surveys');
      }
    } catch (error) {
      navigate('/surveys');
    }
  };

  return (
    <DashboardContainer>
      <StyledHeader>
        <Space>
          {user?.user_type === 1 ? (
            <Shield size={24} color="#667eea" />
          ) : (
            <Building2 size={24} color="#667eea" />
          )}
          <Title level={4} style={{ margin: 0 }}>
            {user?.user_type === 1 ? 'Administrador' : (user?.company?.name || 'Empresa')}
          </Title>
        </Space>
        <Space wrap>
          {user?.user_type === 2 && hasForm && (
            <ShareButton
              type="primary"
              icon={<Share2 size={16} />}
              onClick={() => setShowShareModal(true)}
            >
              Compartilhar Pesquisa
            </ShareButton>
          )}
          {user?.user_type === 1 && (
            <Button
              type="primary"
              icon={<Shield size={16} />}
              onClick={() => navigate('/admin')}
              style={{
                background: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
                border: 'none',
                fontWeight: 600,
              }}
            >
              Painel Admin
            </Button>
          )}
          {user?.user_type === 2 && (
            <Button
              icon={<User size={16} />}
              onClick={() => setShowEditProfileModal(true)}
            >
              Editar Perfil
            </Button>
          )}
          <Button icon={<LogOut size={16} />} onClick={handleLogout}>
            Sair
          </Button>
        </Space>
      </StyledHeader>
      <StyledContent>
        <WelcomeCard>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={2} style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
              Bem-vindo, {user?.login}! 👋
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              {user?.user_type === 1
                ? 'Gerencie empresas, usuários e todo o sistema de forma centralizada.'
                : 'Gerencie suas pesquisas de satisfação de forma simples e eficiente.'}
            </Text>
          </Space>
        </WelcomeCard>

        {user?.user_type === 1 ? (
          <Space size="large" style={{ width: '100%' }} direction="vertical">
            <ActionCard
              onClick={() => navigate('/admin')}
              hoverable
            >
              <Space direction="vertical" size="large">
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 8px 24px rgba(245, 34, 45, 0.3)'
                }}>
                  <Shield size={40} color="#ffffff" />
                </div>
                <Title level={3} style={{ margin: 0 }}>Painel Administrativo</Title>
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  Gerencie empresas e usuários do sistema
                </Text>
              </Space>
            </ActionCard>
          </Space>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Space size="large" style={{ width: '100%' }} direction="vertical">
            {!hasForm ? (
              <ActionCard
                onClick={() => navigate('/create-survey')}
                hoverable
              >
                <Space direction="vertical" size="large">
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                  }}>
                    <Plus size={40} color="#ffffff" />
                  </div>
                  <Title level={3} style={{ margin: 0 }}>Criar Pesquisa</Title>
                  <Text type="secondary" style={{ fontSize: '15px' }}>
                    Crie uma nova pesquisa de satisfação com até 20 perguntas
                  </Text>
                </Space>
              </ActionCard>
            ) : (
              <>
                <ActionCard
                  onClick={handleViewEdit}
                  hoverable
                >
                  <Space direction="vertical" size="large">
                    <div style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                    }}>
                      <FileEdit size={40} color="#ffffff" />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Ver/Editar Formulário</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                      Visualize e edite o formulário de pesquisa criado
                    </Text>
                  </Space>
                </ActionCard>
                <ActionCard
                  onClick={() => navigate('/results')}
                  hoverable
                >
                  <Space direction="vertical" size="large">
                    <div style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)'
                    }}>
                      <BarChart3 size={40} color="#ffffff" />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Ver Resultados</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                      Visualize métricas e gráficos das respostas da sua pesquisa
                    </Text>
                  </Space>
                </ActionCard>
              </>
            )}
          </Space>
        )}
      </StyledContent>
      <Footer />
      {user && user.user_type === 2 && (
        <>
          <ShareLinkModal
            open={showShareModal}
            onClose={() => setShowShareModal(false)}
            companyId={user.company_id || ''}
            companyName={user.company?.name}
          />
          <EditProfileModal
            open={showEditProfileModal}
            onClose={() => setShowEditProfileModal(false)}
            onSuccess={() => {
              // Recarregar dados do usuário após atualização
              window.location.reload();
            }}
          />
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;

