import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MultiFileValidatorPipe implements PipeTransform {
  constructor(
    private readonly validations: Record<
      string,
      { required?: boolean; mimetype?: string[] }
    >,
  ) {}

  transform(value: any) {
    for (const [key, validationOptions] of Object.entries(this.validations)) {
      const file = value?.[key]?.[0];

      if (validationOptions.required && !file) {
        throw new BadRequestException(`${key} is required`);
      }
      if (
        validationOptions.mimetype.length > 0 &&
        !validationOptions.mimetype.includes(file.mimetype)
      ) {
        throw new BadRequestException(
          `${key} must be of type ${validationOptions.mimetype}`,
        );
      }
    }

    return value;
  }
}
