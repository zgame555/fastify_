export enum resCode {
  success = '0',
  required = 'REQUIRED',
  validate = 'VALIDATE',
  id = 'ID',
  duplicate = 'DUPLICATE',
  error = 'ERROR',
  api = 'API',
  not_found = 'NOT_FOUND',
  deleted = 'DELETED',
  permission = 'PERMISSION',
  in_active = 'IN_ACTIVE',
  ip = 'IP',
  api_key = 'API_KEY',
  offline = 'OFFLINE',
  two_factor = 'TWO_FACTOR',
  response_header = 'RESPONSE_HEADER',
  auth = 'UNAUTHORIZED',
  password = 'PASSWORD',
  database = 'DATABASE',
  expired = 'EXPIRED',
}

export enum resMessage {
  success = 'success',
  api = 'error from Api request',
  id = 'id is not found',
  duplicate = 'data is duplicate',
  required_data = 'data is required',
  database = 'database is not connect . .',
  required_content_type = 'content-type in header is required',
  offline = 'server is offline . .',
  required_two_factor = 'two factor is required',
  required_header = 'response header is required',
  required_auth = 'auth is required please login again',
  support = 'please contact support . .',
  required_authorization = 'authorization is required',
  token_expired = 'token is expired',
}

export class CustomError extends Error {
  code?: string
  statusCode?: number
  data?: object
  type?: string

  constructor(message: string, code?: string, statusCode: number = 500, data?: object) {
    super(message)
    this.name = code
    this.message = message
    this.code = code
    this.statusCode = statusCode
    this.data = data
  }
}

export type CustomErrorParams = {
  code?: string
  statusCode?: number
  message: string
  data?: object
  response?: {
    data: any
    message: string
  }
}

export const resError = ({ message, code, statusCode = 400, data, response }: CustomErrorParams, log?: string) => {
  console.log('ERROR ==>', log)

  // AXIOS

  if (response) {
    code = resCode.api
    message = response?.message ?? resMessage.api
    data = response?.data
  }

  // MONGODB
  if (message?.match('ObjectId')) {
    statusCode = 404
    code = code || resCode.id
    message = resMessage.id
  }
  if (message?.match('E11000')) {
    statusCode = 400
    code = resCode.duplicate
    message = resMessage.duplicate
  }

  if (message?.match('required')) {
    statusCode = statusCode || 400
    code = code || resCode.required
    message = message || resMessage.required_data
  }

  // DATABASE
  if (message?.match('Operation')) {
    statusCode = statusCode || 500
    message = message || resMessage.database
    code = code || resCode.database
  }

  throw new CustomError(message, code, statusCode, data)
}

export const validataError = (error: any) => {
  if (error?.statusCode == 415) {
    resError({
      statusCode: 415,
      message: resMessage.required_content_type,
      code: resCode.response_header,
    })
  }
  return error
}

const errorValidation = (message: string, data?: any) => resError({ message, code: resCode.validate, data })

const errorNotFound = (message: string) => resError({ message, code: resCode.not_found })

const errorInActive = (message: string) => resError({ message, code: resCode.in_active })

const errorAuth = (message: string) => resError({ message, code: resCode.auth })

const errorPermission = (message: string) => resError({ message, code: resCode.permission })

const errorDuplicate = (message: string, data?: any) => resError({ message, code: resCode.duplicate, data })

export { errorValidation, errorNotFound, errorInActive, errorAuth, errorPermission, errorDuplicate }

export default resError

export const handleResponseError = (error: any) => {
  console.log('ERROR ==>', error)

  if (error.code == 'ECONNREFUSED') {
    return resError({
      statusCode: 500,
      message: resMessage.offline,
      code: resCode.offline,
    })
  }

  if (error?.response?.data) {
    return { ...error.response.data }
  }
  return { error }
}
