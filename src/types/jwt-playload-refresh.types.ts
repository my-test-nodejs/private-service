import { JwtPlayload } from './jwt-playload.types';

export type JwtPlayloadWithRefreshToken = JwtPlayload & {
  refreshToken: string;
};
