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
      email: email ? email : null,
      password,
    });
    if (error) console.error('Error signing in:', error.message);
  };

  const signUp = async ({ email, password, role }) => {
    const {data, error } = await supabase.auth.signUp({
      email: email ? email : null,
      password,
    });
  console.log('signUp complete')
    if (error) {
      console.error('Error during sign-up/sign-in:', error.message);
      return;
    }
    // If the sign-up/sign-in is successful, assign the role
    if (data) {
        // Assign the role using the user's UUID (from auth.users table)
        const { data2: data, roleError } = await supabase
          .from('user_roles')
          .insert([{ user_id: data.user.id, role }]);
  
        if (roleError) {
          console.error('Error assigning role:', roleError.message);
        } else {
          console.log('Role assigned:', data2);
        }
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