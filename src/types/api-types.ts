export interface User {
  email: string;
  password: string;
}

export interface Active {
  isActive: boolean;
}

export enum Expiration {
  OneMinute = "1m",
  OneDay = "1d",
  ThreeDays = "3d",
  SevenDays = "7d",
  OneTime = "oneTime",
}

export enum ExpirationMilliseconds {
  OneMinute = 60000,
  OneDay = 86400000,
  ThreeDays = 259200000,
  SevenDays = 604800000,
}

export interface Link {
  link: string;
  expiresIn: "1m" | "1d" | "3d" | "7d" | "oneTime";
}

export interface LoginResponse {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZsYWR5c2xhdi5seXNlbmtvQGl0amV0LmlvIiwiaWF0IjoxNjg0NzI5MjUwLCJleHAiOjE2ODQ3MzI4NTB9.P4jB84I5JzTn1J0NtUU4os5iWHX2rtZgbQrq5lZQBWs";
}

export interface LinksResponse {
  links: {
    id: "fd43s2";
    link: "http://localhost:3000/dev/5da2ed";
    expiresIn: "1m";
    createdAt: "2023-05-22T04:28:57.778Z";
    visits: 1;
    isActive: true;
  }[];
}

export interface CreateLinkResponse {
  shortLink: "http://localhost:3000/dev/5da2ed";
}

export interface UpdateLinkResponse {
  linkId: "5da2ed";
  isActive: false;
}
