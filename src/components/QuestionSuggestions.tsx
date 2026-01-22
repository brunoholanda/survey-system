import { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Button,
  Collapse,
  Tag,
  Spin,
  message,
  Empty,
} from 'antd';
import { Plus, Lightbulb } from 'lucide-react';
import styled from 'styled-components';
import { suggestionsService } from '../services/api';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const SuggestionsContainer = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const QuestionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #fafafa;
    border-color: #667eea;
  }
`;

const QuestionText = styled(Text)`
  flex: 1;
  margin-right: 16px;
`;

interface SuggestionQuestion {
  id: string;
  question: string;
  question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
  category: string;
  created_at: string;
  updated_at: string;
}

interface QuestionSuggestionsProps {
  onAddQuestion: (question: {
    question: string;
    question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
    is_optional: boolean;
  }) => void;
  currentQuestionsCount?: number;
  maxQuestions?: number;
}

const QuestionSuggestions: React.FC<QuestionSuggestionsProps> = ({
  onAddQuestion,
  currentQuestionsCount = 0,
  maxQuestions = 20,
}) => {
  const [suggestions, setSuggestions] = useState<SuggestionQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const data = await suggestionsService.getSuggestions();
      setSuggestions(data);
      // Expandir primeira categoria por padrão
      if (data.length > 0) {
        const firstCategory = data[0].category;
        setExpandedCategories([firstCategory]);
      }
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
      message.error('Erro ao carregar sugestões de perguntas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (suggestion: SuggestionQuestion) => {
    if (currentQuestionsCount >= maxQuestions) {
      message.warning(`Máximo de ${maxQuestions} perguntas permitidas`);
      return;
    }

    onAddQuestion({
      question: suggestion.question,
      question_type: suggestion.question_type,
      is_optional: false,
    });

    message.success('Pergunta adicionada com sucesso!');
  };

  // Agrupar sugestões por categoria
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, SuggestionQuestion[]>);

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'scale_0_5':
        return 'Escala 0-5';
      case 'scale_0_10':
        return 'Escala 0-10';
      case 'text_opinion':
        return 'Texto';
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'scale_0_5':
        return 'blue';
      case 'scale_0_10':
        return 'purple';
      case 'text_opinion':
        return 'green';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <SuggestionsContainer>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Carregando sugestões...</Text>
          </div>
        </div>
      </SuggestionsContainer>
    );
  }

  if (suggestions.length === 0) {
    return (
      <SuggestionsContainer>
        <Empty
          description="Nenhuma sugestão disponível no momento"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </SuggestionsContainer>
    );
  }

  return (
    <SuggestionsContainer>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Lightbulb size={20} color="#667eea" />
          <Title level={5} style={{ margin: 0 }}>
            Sugestões de Perguntas
          </Title>
        </Space>
        <Text type="secondary">
          Clique em "Adicionar" para incluir uma pergunta sugerida ao seu formulário
        </Text>

        <Collapse
          activeKey={expandedCategories}
          onChange={(keys) => setExpandedCategories(keys as string[])}
          style={{ width: '100%' }}
        >
          {Object.entries(groupedSuggestions).map(([category, questions]) => (
            <Panel
              key={category}
              header={
                <CategoryHeader>
                  <Text strong>{category}</Text>
                  <Tag color="default">{questions.length} perguntas</Tag>
                </CategoryHeader>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                {questions.map((suggestion) => (
                  <QuestionItem key={suggestion.id}>
                    <QuestionText>{suggestion.question}</QuestionText>
                    <Space>
                      <Tag color={getQuestionTypeColor(suggestion.question_type)}>
                        {getQuestionTypeLabel(suggestion.question_type)}
                      </Tag>
                      <Button
                        type="primary"
                        size="small"
                        icon={<Plus size={14} />}
                        onClick={() => handleAddQuestion(suggestion)}
                        disabled={currentQuestionsCount >= maxQuestions}
                      >
                        Adicionar
                      </Button>
                    </Space>
                  </QuestionItem>
                ))}
              </Space>
            </Panel>
          ))}
        </Collapse>
      </Space>
    </SuggestionsContainer>
  );
};

export default QuestionSuggestions;

