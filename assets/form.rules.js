rules=[
{
    "name": "firstname",
    "required": true,
    "requiredMsg": "\"Vorname\" ist ein Pflichtfeld!",
    "validate": "isText",
    "validatedMsg": "Bitte geben Sie nur Text in das Feld \"Vorname\" ein!"
  },
  {
    "name": "lastname",
    "required": true,
    "requiredMsg": "\"Nachname\" ist ein Pflichtfeld!",
    "validate": "isText",
    "validatedMsg": "Bitte geben Sie nur Text in das Feld \"Nachname\" ein!"
  },    
  {
    "name": "zip",
    "required": true,
    "requiredMsg": "\"Postleitzahl\" ist ein Pflichtfeld!",
    "validate": "isGermanPLZ",
    "validatedMsg": "Bitte geben Sie eine gueltige deutsche Postleitzahl ein!"
  },    
  {
    "name": "age",
    "required": false,
    "validate": "isNumber",
    "validatedMsg": "Bitte geben sie in das Feld \"Alter\" ausschliesslich Zahlen ein!"
  },  
  {
    "name": "city",
    "required": true,
    "requiredMsg": "\"Wohnort\" ist ein Pflichtfeld!",
    "validate": "isText",
    "validatedMsg": "Bitte geben Sie nur Text in das Feld \"Wohnort\" ein!"
  },    
  {
    "name": "title",
    "required": true,
    "requiredMsg": "\"Anrede\" ist ein Pflichtfeld!"
  },    
  {
    "name": "gender",
    "required": true,
    "requiredMsg": "\"Geschlecht\" ist ein Pflichtfeld!"
  },    
  {
    "name": "email",
    "required": true,
    "requiredMsg": "\"E-Mail\" ist ein Pflichtfeld!",
    "validate": "isEmail",
    "validatedMsg": "Bitte geben Sie eine gueltige E-Mail Adresse ein!"
  }
];