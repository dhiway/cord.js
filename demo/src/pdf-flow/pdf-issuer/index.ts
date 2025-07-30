import inquirer from 'inquirer';
import { generatePdfWithMetadata } from './generatePdf';

/* Make these data modular, from chain */
/* Create a account derived from Alice, and a registry */
export const GLOBAL_REGISTRY_ID = "Tt6fvp5LP3tEmNivbXu28Tm8RWnwbCZTpsXg2JdTUGWRcEbtYTwAVEz"
export const GLOBAL_ISSUER_ADDRESS = "3ukwFjWy69cLL6ab5LAHMKfygau6oJS3xeDbKKwbsRVnKeZA"

async function main() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Student Name:' },
    { type: 'input', name: 'rollNumber', message: 'Roll Number:' },
    { type: 'input', name: 'course', message: 'Course:' },
    { type: 'input', name: 'issueDate', message: 'Issue Date (YYYY-MM-DD):' }
  ]);

  const fieldData = {
    name: answers.name,
    rollNumber: answers.rollNumber,
    course: answers.course,
    issueDate: answers.issueDate,
  };

  await generatePdfWithMetadata(fieldData, GLOBAL_REGISTRY_ID, GLOBAL_ISSUER_ADDRESS);
  console.log("✅ PDF generated with embedded metadata. Check /output folder.");
}

main();
