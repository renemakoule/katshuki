// lib/services/validation.service.ts

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class ValidationService {
  public validateAndSanitize(choices: any, useCase: string): ValidationResult {
    if (!useCase || typeof useCase !== 'string' || useCase.trim() === '') {
      return { isValid: false, errors: ["'useCase' must be a non-empty string."] };
    }

    if (!choices || typeof choices !== 'object') {
      return { isValid: false, errors: ["'choices' must be an object."] };
    }

    const errors: string[] = [];

    // Sanitize useCase to prevent injection attacks
    const sanitizedUseCase = useCase.trim();

    switch (sanitizedUseCase) {
      case 'GENERATE_REPORT':
        if (typeof choices.reportType !== 'string' || choices.reportType.trim() === '') {
          errors.push('For GENERATE_REPORT, a non-empty reportType string is required in choices.');
        }
        // Sanitize input
        choices.reportType = choices.reportType?.trim();
        break;

      case 'SUMMARIZE_TEXT':
        if (typeof choices.textToSummarize !== 'string' || choices.textToSummarize.trim() === '') {
          errors.push('For SUMMARIZE_TEXT, a non-empty textToSummarize string is required in choices.');
        }
         // Sanitize input
        choices.textToSummarize = choices.textToSummarize?.trim();
        break;

      // Add more cases here for other use cases

      default:
        errors.push(`Unknown or unsupported useCase: '${sanitizedUseCase}'.`);
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public validateImageGenerationParams(params: any): ValidationResult {
    const errors: string[] = [];
    if (!params || typeof params.prompt !== 'string' || params.prompt.trim() === '') {
      errors.push('A non-empty prompt is required for image generation.');
    }
    // Future validation: check image size, quality settings, etc.
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const validationService = new ValidationService();