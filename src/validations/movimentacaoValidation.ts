import * as yup from 'yup';

export const movimentacaoValidationSchema = yup.object().shape({
  id_produto: yup
    .number()
    .required('Produto é obrigatório')
    .positive('Produto inválido'),
  
  tipo: yup
    .string()
    .required('Tipo é obrigatório')
    .oneOf(['ENTRADA', 'RETIRADA'], 'Tipo inválido'),
  
  quantidade: yup
    .number()
    .required('Quantidade é obrigatória')
    .integer('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade deve ser maior que zero'),
  
  data: yup
    .date()
    .required('Data é obrigatória')
    .typeError('Data inválida'),
  
  observacao: yup
    .string()
    .max(500, 'Observação deve ter no máximo 500 caracteres'),
  
  motivo: yup
    .string()
    .required('Motivo é obrigatório')
    .oneOf(['COMPRA', 'VENDA', 'USO_INTERNO', 'DEVOLUCAO', 'PERDA', 'AJUSTE'], 'Motivo inválido'),
  
  id_movimentacao_original: yup
    .number()
    .nullable()
    .positive('Movimentação original inválida')
});

export type MovimentacaoFormData = yup.InferType<typeof movimentacaoValidationSchema>;