import { AuthProvider } from "./AuthContext";
import { MessageBoxProvider } from "./MessageBoxContext";

export const ContextProviders = ({ children }) => (
    <AuthProvider>
        <MessageBoxProvider>
            {children}
        </MessageBoxProvider>
    </AuthProvider>
);