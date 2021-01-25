export default {
    type: ['Credential', 'SimpleExampleCredential'],
    name: 'Example Name and Age',
    context: [
      {
        SimpleExample: 'https://example.com/terms/SimpleExampleCredential',
        schema: 'https://schema.org/',
        age: 'schema:age',
        name: 'schema:name',
      },
    ]
}