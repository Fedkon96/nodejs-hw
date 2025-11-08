import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

let cachedTemplateSource = null;
let cachedTemplate = null;

export async function renderResetPasswordEmail({ name, link }) {
  if (!cachedTemplate) {
    const templatePath = path.resolve(
      'src/templates/reset-password-email.html'
    );
    if (!cachedTemplateSource) {
      cachedTemplateSource = await fs.readFile(templatePath, 'utf-8');
    }
    cachedTemplate = handlebars.compile(cachedTemplateSource);
  }
  return cachedTemplate({ name, link });
}
