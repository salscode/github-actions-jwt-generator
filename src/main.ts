import * as core from '@actions/core';
import * as jwt from 'jsonwebtoken';

type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512';

interface JwtOptions {
  algorithm: JwtAlgorithm;
  expiresIn?: string;
}

// Type guard to check if value is a plain object
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateAlgorithm(algo: string): JwtAlgorithm {
  const validAlgorithms: JwtAlgorithm[] = ['HS256', 'HS384', 'HS512'];
  if (!validAlgorithms.includes(algo as JwtAlgorithm)) {
    throw new Error(`Invalid algorithm. Must be one of: ${validAlgorithms.join(', ')}`);
  }
  return algo as JwtAlgorithm;
}

function parsePayload(payloadStr: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(payloadStr);
    if (!isPlainObject(parsed)) {
      throw new Error('Payload must be a JSON object');
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid JSON payload: ${error.message}`);
    }
    throw new Error('Invalid JSON payload provided');
  }
}

export async function run(): Promise<void> {
  try {
    // Get and validate inputs
    const secret = core.getInput('secret', { required: true });
    const payloadStr = core.getInput('payload', { required: true });
    const algorithmInput = core.getInput('algorithm') || 'HS256';
    const expiresIn = core.getInput('expiresIn');

    // Validate algorithm
    const algorithm = validateAlgorithm(algorithmInput);

    // Parse payload
    const payload = parsePayload(payloadStr);

    // Create options object
    const options: JwtOptions = {
      algorithm,
      ...(expiresIn && { expiresIn })
    };

    // Sign token
    const token = jwt.sign(payload, secret, options);
    
    // Set output
    core.setOutput('token', token);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();
