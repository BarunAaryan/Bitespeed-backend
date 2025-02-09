import { Request, Response } from 'express';
import { identifyContact } from '../services/contactService';

export const identifyController = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  try {
    const contact = await identifyContact(email, phoneNumber);
    res.json({ contact });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};