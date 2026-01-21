import { Modal, Input, Button, Space, message, Typography } from 'antd';
import { Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

interface ShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  companyName?: string;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  open,
  onClose,
  companyId,
  companyName,
}) => {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/survey/${companyId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      message.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error('Erro ao copiar link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pesquisa de Satisfação - ${companyName || 'Empresa'}`,
          text: 'Ajude-nos respondendo nossa pesquisa de satisfação!',
          url: publicUrl,
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          message.error('Erro ao compartilhar');
        }
      }
    } else {
      // Fallback: copiar para área de transferência
      handleCopy();
    }
  };

  return (
    <Modal
      title="Link Público da Pesquisa"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
      ]}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>Compartilhe este link para que seus clientes possam responder a pesquisa:</Text>
        </div>
        <Input.Group compact>
          <Input
            value={publicUrl}
            readOnly
            style={{ flex: 1 }}
            size="large"
          />
          <Button
            type="primary"
            icon={copied ? <Check size={16} /> : <Copy size={16} />}
            onClick={handleCopy}
            size="large"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        </Input.Group>
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              type="default"
              icon={<Share2 size={16} />}
              onClick={handleShare}
              size="large"
            >
              Compartilhar
            </Button>
          )}
        </Space>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Qualquer pessoa com este link poderá responder sua pesquisa de satisfação.
        </Text>
      </Space>
    </Modal>
  );
};

export default ShareLinkModal;

