import prisma from '../utils/prisma';

export const identifyContact = async (email?: string, phoneNumber?: string) => {
  if (!email && !phoneNumber) {
    throw new Error('Either email or phoneNumber must be provided');
  }

  // Find existing contacts by email or phoneNumber
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    }
  });

  if (existingContacts.length === 0) {
    // No existing contacts, create a new primary contact
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      }
    });

    return {
      primaryContactId: newContact.id,
      emails: [newContact.email],
      phoneNumbers: [newContact.phoneNumber],
      secondaryContactIds: []
    };
  }

  // Consolidate contacts
  const primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];
  const secondaryContacts = existingContacts.filter(contact => contact.id !== primaryContact.id);

  // Update secondary contacts if necessary
  for (const contact of secondaryContacts) {
    if (contact.linkedId !== primaryContact.id) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: { linkedId: primaryContact.id, linkPrecedence: 'secondary' }
      });
    }
  }

  // Collect emails and phone numbers
  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds = new Set<number>();

  for (const contact of existingContacts) {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    if (contact.linkPrecedence === 'secondary') secondaryContactIds.add(contact.id);
  }

  // Add the new email if it doesn't exist
  if (email && !emails.has(email)) {
    emails.add(email);
    const newSecondaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary'
      }
    });
    secondaryContactIds.add(newSecondaryContact.id);
  }

  return {
    primaryContactId: primaryContact.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: Array.from(secondaryContactIds)
  };
};