import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const StyledFooter = styled(AntFooter)`
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  text-align: center;
  position: relative;
  z-index: 1;

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
        <Text type="secondary" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Holanda Desenvolvimento de Software ME 50.509.731/0001-35
        </Text>
        <Text type="secondary" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Copyright© Holanda Dev Software 2026. Todos os direitos reservados.
        </Text>
      </FooterContent>
    </StyledFooter>
  );
};

export default Footer;

