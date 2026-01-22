import { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Layout, Spin } from 'antd';
import { Plus, LogOut, Building2, FileEdit, Copy, Share2, User, BarChart3, Shield } from 'lucide-react';
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
  position: sticky;
  top: 0;
  z-index: 1000;
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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 48px 24px;
  }

  @media (min-width: 1024px) {
    padding: 48px;
  }
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
`;

const ActionCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }

  .ant-card-body {
    padding: 24px 16px;

    @media (min-width: 768px) {
      padding: 32px 24px;
    }
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
        <Space>
          {user?.user_type === 1 && (
            <Button
              type="primary"
              icon={<Shield size={16} />}
              onClick={() => navigate('/admin')}
              style={{
                background: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
                border: 'none',
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
          <Title level={2}>Bem-vindo, {user?.login}!</Title>
          <Text type="secondary">
            {user?.user_type === 1
              ? 'Gerencie empresas, usuários e todo o sistema.'
              : 'Gerencie suas pesquisas de satisfação de forma simples e eficiente.'}
          </Text>
        </WelcomeCard>

        {user?.user_type === 1 ? (
          <Space size="large" style={{ width: '100%' }} direction="vertical">
            <ActionCard
              onClick={() => navigate('/admin')}
              hoverable
            >
              <Space direction="vertical" size="large">
                <Shield size={48} color="#f5222d" />
                <Title level={3}>Painel Administrativo</Title>
                <Text type="secondary">
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
                  <Plus size={48} color="#667eea" />
                  <Title level={3}>Criar Pesquisa</Title>
                  <Text type="secondary">
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
                    <FileEdit size={48} color="#667eea" />
                    <Title level={3}>Ver/Editar Formulário de Pesquisa</Title>
                    <Text type="secondary">
                      Visualize e edite o formulário de pesquisa criado
                    </Text>
                  </Space>
                </ActionCard>
                <ActionCard
                  onClick={() => navigate('/results')}
                  hoverable
                >
                  <Space direction="vertical" size="large">
                    <BarChart3 size={48} color="#667eea" />
                    <Title level={3}>Ver Resultados</Title>
                    <Text type="secondary">
                      Visualize métricas e gráficos das respostas da sua pesquisa
                    </Text>
                  </Space>
                </ActionCard>
                <Card style={{ borderRadius: 8 }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Title level={4}>Compartilhar Pesquisa</Title>
                    <Text type="secondary">
                      Compartilhe o link público da sua pesquisa para que seus clientes possam responder
                    </Text>
                    <Space>
                      <Button
                        type="primary"
                        icon={<Copy size={16} />}
                        onClick={() => setShowShareModal(true)}
                      >
                        Copiar Link
                      </Button>
                      {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <Button
                          icon={<Share2 size={16} />}
                          onClick={() => setShowShareModal(true)}
                        >
                          Compartilhar
                        </Button>
                      )}
                    </Space>
                  </Space>
                </Card>
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

