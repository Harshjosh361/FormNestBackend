import { google } from 'googleapis';

async function createForm(accessToken, title, questions) {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const forms = google.forms({ version: 'v1', auth });

    const createRes = await forms.forms.create({
      requestBody: {
        info: {
          title,
          documentTitle: title,
        },
      },
    });

    const formId = createRes.data.formId;

    const requests = questions.map((q, index) => ({
      createItem: {
        item: {
          title: q.label,
          questionItem: {
            question: {
              required: q.required !== false,
              textQuestion: q.type === 'text' ? {} : undefined,
              choiceQuestion: q.type === 'multiple_choice'
                ? {
                    type: 'RADIO',
                    options: q.options.map(opt => ({ value: opt })),
                  }
                : undefined,
            },
          },
        },
        location: { index },
      },
    }));

    await forms.forms.batchUpdate({
      formId,
      requestBody: { requests },
    });

    return {
      formId,
      responderUri: createRes.data.responderUri,
      editUri: `https://docs.google.com/forms/d/${formId}/edit`,
    };
  } catch (error) {
    console.error('Error creating form:', error);
    throw new Error(`Failed to create form: ${error.message}`);
  }
}

export default createForm;
  