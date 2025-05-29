import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";

interface ValidationErrorResponse {
  message: string[];
  error: string;
  statusCode: number;
}

interface StandardErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: string;
  message: string;
  details?: string[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = this.buildErrorResponse(
      status,
      request,
      exception,
      exceptionResponse,
    );

    response.status(status).json(errorResponse);
  }

  private buildErrorResponse(
    status: number,
    request: Request,
    exception: HttpException,
    exceptionResponse: string | object,
  ): ErrorResponseBody {
    const baseResponse: Omit<ErrorResponseBody, "error" | "message"> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (exception instanceof BadRequestException) {
      return this.handleBadRequestException(baseResponse, exceptionResponse);
    }

    return this.handleGenericException(baseResponse, exceptionResponse);
  }

  private handleBadRequestException(
    baseResponse: Omit<ErrorResponseBody, "error" | "message">,
    exceptionResponse: string | object,
  ): ErrorResponseBody {
    if (this.isValidationErrorResponse(exceptionResponse)) {
      return {
        ...baseResponse,
        error: "Validation Failed",
        message: "Request validation failed",
        details: exceptionResponse.message,
      };
    }

    if (this.isStandardErrorResponse(exceptionResponse)) {
      return {
        ...baseResponse,
        error: exceptionResponse.error || "Bad Request",
        message: exceptionResponse.message,
      };
    }

    return {
      ...baseResponse,
      error: "Bad Request",
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : "Bad Request",
    };
  }

  private handleGenericException(
    baseResponse: Omit<ErrorResponseBody, "error" | "message">,
    exceptionResponse: string | object,
  ): ErrorResponseBody {
    if (this.isStandardErrorResponse(exceptionResponse)) {
      return {
        ...baseResponse,
        error: exceptionResponse.error || "Internal Server Error",
        message: exceptionResponse.message,
      };
    }

    return {
      ...baseResponse,
      error: "Internal Server Error",
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : "An error occurred",
    };
  }

  private isValidationErrorResponse(
    response: string | object,
  ): response is ValidationErrorResponse {
    return (
      typeof response === "object" &&
      response !== null &&
      "message" in response &&
      Array.isArray((response as ValidationErrorResponse).message) &&
      "error" in response &&
      "statusCode" in response
    );
  }

  private isStandardErrorResponse(
    response: string | object,
  ): response is StandardErrorResponse {
    return (
      typeof response === "object" &&
      response !== null &&
      "message" in response &&
      typeof (response as StandardErrorResponse).message === "string"
    );
  }
}
