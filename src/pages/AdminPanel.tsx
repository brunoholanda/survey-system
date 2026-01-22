import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Typography,
  Space,
  Layout,
  Table,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
} from 'antd';
import {
  ArrowLeft,
  Building2,
  UserPlus,
  Users,
  Plus,
  Shield,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { adminService } from '../services/api';
import Footer from '../components/Footer';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const AdminContainer = styled(Layout)`
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

interface Company {
  id: string;
  name: string;
  cnpj: string;
  description?: string;
  address?: string;
  logo_path?: string;
  created_at: string;
}

interface UserData {
  id: string;
  login: string;
  user_type: 1 | 2;
  company_id: string | null;
  company?: Company;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [companyForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    // Carregar companies quando abrir modal de usuário
    if (showUserModal && companies.length === 0) {
      loadCompanies();
    }
  }, [showUserModal]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const data = await adminService.getAllCompanies();
      setCompanies(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        message.error('Erro ao carregar empresas');
      }
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'companies') {
        try {
          const data = await adminService.getAllCompanies();
          setCompanies(data);
        } catch (error: any) {
          // Se o endpoint não existir, usar array vazio
          if (error.response?.status === 404) {
            setCompanies([]);
            message.warning('Endpoint de listagem de empresas não disponível');
          } else {
            throw error;
          }
        }
      } else {
        try {
          const data = await adminService.getAllUsers();
          setUsers(data);
        } catch (error: any) {
          // Se o endpoint não existir, usar array vazio
          if (error.response?.status === 404) {
            setUsers([]);
            message.warning('Endpoint de listagem de usuários não disponível');
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (values: any) => {
    try {
      await adminService.createCompany(values);
      message.success('Empresa criada com sucesso!');
      setShowCompanyModal(false);
      companyForm.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao criar empresa');
    }
  };

  const handleCreateUser = async (values: any) => {
    try {
      await adminService.createUser(values);
      message.success('Usuário criado com sucesso!');
      setShowUserModal(false);
      userForm.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao criar usuário');
    }
  };

  const companyColumns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Data de Criação',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
  ];

  const userColumns = [
    {
      title: 'Login',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Tipo',
      dataIndex: 'user_type',
      key: 'user_type',
      render: (type: number) => (
        <Tag color={type === 1 ? 'red' : 'blue'}>
          {type === 1 ? 'Administrador' : 'Usuário'}
        </Tag>
      ),
    },
    {
      title: 'Empresa',
      dataIndex: 'company',
      key: 'company',
      render: (company: Company | null) => company?.name || '-',
    },
    {
      title: 'Data de Criação',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <AdminContainer>
      <StyledHeader>
        <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={24} color="#667eea" />
          <Title level={4} style={{ margin: 0 }}>
            Painel Administrativo
          </Title>
        </div>
        <div />
      </StyledHeader>
      <StyledContent>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Title level={3}>Gerenciamento do Sistema</Title>
            <Text type="secondary">
              Gerencie empresas e usuários do sistema
            </Text>
            <Space>
              <Button
                type={activeTab === 'companies' ? 'primary' : 'default'}
                icon={<Building2 size={16} />}
                onClick={() => setActiveTab('companies')}
              >
                Empresas
              </Button>
              <Button
                type={activeTab === 'users' ? 'primary' : 'default'}
                icon={<Users size={16} />}
                onClick={() => setActiveTab('users')}
              >
                Usuários
              </Button>
            </Space>
          </Space>
        </Card>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {activeTab === 'companies' ? (
            <>
              <Card
                style={{ borderRadius: 8 }}
                extra={
                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => setShowCompanyModal(true)}
                  >
                    Nova Empresa
                  </Button>
                }
              >
                <Title level={4}>Empresas Cadastradas</Title>
                <Table
                  columns={companyColumns}
                  dataSource={companies}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </>
          ) : (
            <>
              <Card
                style={{ borderRadius: 8 }}
                extra={
                  <Button
                    type="primary"
                    icon={<UserPlus size={16} />}
                    onClick={() => setShowUserModal(true)}
                  >
                    Novo Usuário
                  </Button>
                }
              >
                <Title level={4}>Usuários Cadastrados</Title>
                <Table
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </>
          )}
        </Space>
      </StyledContent>
      <Footer />

      {/* Modal Criar Empresa */}
      <Modal
        title={
          <Space>
            <Building2 size={20} />
            <span>Criar Nova Empresa</span>
          </Space>
        }
        open={showCompanyModal}
        onCancel={() => {
          setShowCompanyModal(false);
          companyForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={companyForm}
          layout="vertical"
          onFinish={handleCreateCompany}
        >
          <Form.Item
            label="Nome da Empresa"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira o nome da empresa!' }]}
          >
            <Input placeholder="Nome da empresa" size="large" />
          </Form.Item>

          <Form.Item
            label="CNPJ"
            name="cnpj"
            rules={[{ required: true, message: 'Por favor, insira o CNPJ!' }]}
          >
            <Input placeholder="00.000.000/0000-00" size="large" />
          </Form.Item>

          <Form.Item
            label="Descrição"
            name="description"
          >
            <TextArea
              rows={4}
              placeholder="Descrição da empresa"
            />
          </Form.Item>

          <Form.Item
            label="Endereço"
            name="address"
          >
            <TextArea
              rows={3}
              placeholder="Endereço da empresa"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setShowCompanyModal(false);
                companyForm.resetFields();
              }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Criar Empresa
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Criar Usuário */}
      <Modal
        title={
          <Space>
            <UserPlus size={20} />
            <span>Criar Novo Usuário</span>
          </Space>
        }
        open={showUserModal}
        onCancel={() => {
          setShowUserModal(false);
          userForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            label="Login"
            name="login"
            rules={[{ required: true, message: 'Por favor, insira o login!' }]}
          >
            <Input placeholder="Login do usuário" size="large" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira a senha!' }]}
          >
            <Input.Password placeholder="Senha do usuário" size="large" />
          </Form.Item>

          <Form.Item
            label="Tipo de Usuário"
            name="user_type"
            rules={[{ required: true, message: 'Por favor, selecione o tipo de usuário!' }]}
          >
            <Select size="large" placeholder="Selecione o tipo">
              <Option value={1}>
                <Space>
                  <Shield size={16} />
                  <span>Administrador</span>
                </Space>
              </Option>
              <Option value={2}>
                <Space>
                  <User size={16} />
                  <span>Usuário (Empresa)</span>
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.user_type !== currentValues.user_type
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('user_type') === 2 ? (
                <Form.Item
                  label="Empresa"
                  name="company_id"
                  rules={[{ required: true, message: 'Por favor, selecione a empresa!' }]}
                >
                  <Select
                    size="large"
                    placeholder="Selecione a empresa"
                    loading={loadingCompanies}
                    showSearch
                    filterOption={(input, option) => {
                      const label = String(option?.label ?? '');
                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {companies.map((company) => (
                      <Option key={company.id} value={company.id} label={company.name}>
                        {company.name} - {company.cnpj}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setShowUserModal(false);
                userForm.resetFields();
              }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Criar Usuário
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminContainer>
  );
};

export default AdminPanel;

