import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const StyledFooter = styled(AntFooter)`
  background: #f5f5f5 !important;
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <FooterContent>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Holanda Desenvolvimento de Software ME 50.509.731/0001-35
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Copyright© Holanda Dev Software 2026. Todos os direitos reservados.
        </Text>
      </FooterContent>
    </StyledFooter>
  );
};

export default Footer;

