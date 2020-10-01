import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  const parts = authHeader.split(' ');
  if (!parts.length === 2)
    return res.status(401).send({ error: 'Invalid token format' });
  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted' });

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    req.userIsAdmin = decoded.admin;
    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Token invalid' });
  }
};
