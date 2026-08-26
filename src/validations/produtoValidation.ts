import * as yup from 'yup';

export const produtoValidationSchema = yup.object().shape({
  codigo: yup
    .string()
    .required('Código é obrigatório')
    .min(3, 'Código deve ter no mínimo 3 caracteres')
    .max(50, 'Código deve ter no máximo 50 caracteres'),
  
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  descricao: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  id_categoria: yup
    .number()
    .required('Categoria é obrigatória')
    .positive('Categoria inválida'),
  
  preco_unitario: yup
    .number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser maior que zero')
    .typeError('Preço deve ser um número válido'),
  
  quantidade_disponivel: yup
    .number()
    .required('Quantidade disponível é obrigatória')
    .integer('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa'),
  
  quantidade_minima: yup
    .number()
    .required('Quantidade mínima é obrigatória')
    .integer('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade mínima não pode ser negativa'),
  
  status: yup
    .string()
    .required('Status é obrigatório')
    .oneOf(['ATIVO', 'INATIVO'], 'Status inválido')
});

export type ProdutoFormData = yup.InferType<typeof produtoValidationSchema>;