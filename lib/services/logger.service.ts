 export enum LogCategory {
  GENERAL = "GENERAL",
  API = "API",
  DATABASE = "DATABASE",
  AUTHENTICATION = "AUTHENTICATION",
  METRIC = "METRIC",
  GENERATION = "GENERATION",
}

const log = (level: string, category: LogCategory, message: string, data?: any) => {
  const logObject = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    data,
  };
  console.log(JSON.stringify(logObject));
};

export const logger = {
  info: (category: LogCategory, message: string, data?: any) => log("INFO", category, message, data),
  warn: (category: LogCategory, message: string, data?: any) => log("WARN", category, message, data),
  error: (category: LogCategory, message: string, data?: any) => log("ERROR", category, message, data),
  debug: (category: LogCategory, message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      log("DEBUG", category, message, data);
    }
  },
};