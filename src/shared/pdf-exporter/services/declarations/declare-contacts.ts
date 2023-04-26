import { CONTACTS } from '../../constants';
import { CompanyColorsType } from '../../types';

export function declareContacts(
  contacts: any[],
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  const defaultSpaceBetweenRows = size === 'lg' ? 10 : 5;
  const firstContactsRow = [
    {
      text: CONTACTS,
      fontSize: size === 'lg' ? 8 : 6,
      bold: true,
      margin: [0, 0, 0, 4],
    },
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  const result = {
    layout: {
      vLineWidth: () => 0,
      hLineWidth: (rowIndex: number) =>
        rowIndex === 0 || rowIndex === 1 ? 0 : defaultSpaceBetweenRows,
      hLineColor: () => '#fff',
      paddingTop: () => 0,
      paddingBottom: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
    },
    table: {
      dontBreakRows: true,
      keepWithHeaderRows: true,
      headerRows: 1,
      widths:
        size === 'lg'
          ? [141, 10, 141, 10, 141, 10, 141, 0]
          : [111, 10, 111, 10, 111, 10, 111, 10, 112, 0],
      body: [
        // For default PDF export we have 4 contacts per row, for a small PDF export we have 5 contacts per row
        size === 'lg' ? firstContactsRow : [...firstContactsRow, '', ''],
        ...getRows(contacts, colors, size),
      ],
    },
  };

  return result;
}

function getRows(
  contacts: any[],
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  const table = [];

  const i = 0;

  for (let i = 0; i < contacts.length; ++i) {
    const contact = contacts[i];

    if (size === 'lg' && i % 4 === 0) {
      table.push([]);
    } else if (size === 'sm' && i % 5 === 0) {
      table.push([]);
    }

    table[table.length - 1].push(createContactCell(contact, colors, size));
    table[table.length - 1].push('');
  }

  const columnsInTable = size === 'lg' ? 8 : 10;

  if (table[table.length - 1].length < columnsInTable) {
    const diff = columnsInTable - table[table.length - 1].length;

    for (let i = 0; i < diff; ++i) {
      table[table.length - 1].push('');
    }
  }

  return table;
}

function createContactCell(
  contact: any,
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  const result = {
    stack: [],
    style: size === 'lg' ? 'contactCard' : 'contactCardSmall',
  };

  if (contact.firstName || contact.lastName) {
    result.stack.push({
      text: contact.firstName + ' ' + contact.lastName,
      margin: size === 'lg' ? [0, 0, 0, 8] : [0, 0, 0, 4],
      bold: true,
      fontSize: size === 'lg' ? 7 : 6,
    });
  }

  if (contact.companyName) {
    result.stack.push({
      text: contact.companyName,
      fontSize: size === 'lg' ? 7 : 6,
    });
  }

  if (contact.jobTitle) {
    result.stack.push({
      text: contact.jobTitle,
      fontSize: size === 'lg' ? 7 : 6,
    });
  }

  if (contact.phone) {
    result.stack.push({
      text: contact.phone,
      color: colors.primary,
      bold: true,
      fontSize: size === 'lg' ? 7 : 6,
    });
  }

  if (contact.contactEmail) {
    result.stack.push({
      text: contact.contactEmail,
      fontSize: size === 'lg' ? 7 : 6,
    });
  }

  return result;
}
