import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Avatar,
  Typography,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { User, Building2 } from 'lucide-react';
import type { UploadFile } from 'antd';
import { companiesService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { convertToWebP } from '../utils/imageUtils';

const { TextArea } = Input;
const { Text } = Typography;

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (open && user?.company) {
      form.setFieldsValue({
        name: user.company.name,
        description: user.company.description,
        cnpj: user.company.cnpj,
        address: user.company.address,
      });
      if (user.company.logo_path) {
        const logoUrl = user.company.logo_path.startsWith('http')
          ? user.company.logo_path
          : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${user.company.logo_path}`;
        setLogoPreview(logoUrl);
      }
    }
  }, [open, user, form]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // Converter para WebP e comprimir
      const webpFile = await convertToWebP(file);

      const formData = new FormData();
      formData.append('logo', webpFile);

      const response = await companiesService.uploadLogo(formData);

      message.success('Logo atualizado com sucesso!');
      setLogoPreview(response.logo_path.startsWith('http')
        ? response.logo_path
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${response.logo_path}`);

      if (onSuccess) {
        onSuccess();
      }

      return false; // Prevenir upload automático
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao fazer upload da logo');
      return false;
    } finally {
      setUploading(false);
      setFileList([]);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await companiesService.update(values);
      message.success('Perfil atualizado com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: handleUpload,
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList);
    },
    showUploadList: false,
    accept: 'image/*',
  };

  return (
    <Modal
      title={
        <Space>
          <User size={20} />
          <span>Editar Perfil</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ textAlign: 'center' }}>
            <Avatar
              size={100}
              src={logoPreview}
              icon={<Building2 size={40} />}
              style={{ marginBottom: 16 }}
            />
            <div>
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  loading={uploading}
                  disabled={uploading}
                >
                  {logoPreview ? 'Alterar Logo' : 'Enviar Logo'}
                </Button>
              </Upload>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Formatos aceitos: JPEG, PNG, WebP, GIF. Máximo 5MB.
                  <br />
                  A imagem será convertida para WebP automaticamente.
                </Text>
              </div>
            </div>
          </div>

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
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Salvar Alterações
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;

