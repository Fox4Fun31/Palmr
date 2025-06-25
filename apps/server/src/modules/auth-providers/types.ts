export interface ProviderConfig {
  name: string;
  issuerUrl?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userInfoEndpoint?: string;
  supportsDiscovery: boolean;
  discoveryEndpoint?: string;
  fallbackEndpoints?: {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint: string;
  };
  authMethod: "body" | "basic" | "header";
  specialHandling?: {
    emailEndpoint?: string;
    emailFetchRequired?: boolean;
    responseFormat?: string;
    urlCleaning?: {
      removeFromEnd: string[];
    };
  };
  fieldMappings: {
    id: string[];
    email: string[];
    name: string[];
    firstName: string[];
    lastName: string[];
    avatar: string[];
  };
}

export interface ProvidersConfigFile {
  officialProviders: Record<string, ProviderConfig>;
  genericProviderTemplate: ProviderConfig;
}

export interface ProviderEndpoints {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
}

export interface ProviderUserInfo {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  [key: string]: any;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export interface AuthResult {
  userInfo: ProviderUserInfo;
  tokens: TokenResponse;
}
