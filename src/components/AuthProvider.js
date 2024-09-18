import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabaseClient';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth State Changed', event)
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password
    });
    if (error) console.error('Error signing in:', error.message);
  };

  const signUp = async ({ email, password, firstName, lastName,mobile }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email ? email : null,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: mobile
        },
      }

    });
    console.log('signUp complete')
    if (error) {
      console.error('Error during sign-up/sign-in:', error.message);
      return;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };


  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;