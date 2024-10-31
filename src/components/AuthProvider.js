import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      // if (currentUser) {
      //   const { data: profileData, error } = await supabase
      //     .from('Businesses')
      //     .select('*')
      //     .eq('id', currentUser.id)
      //     .single();

      //   if (error) {
      //     setToast({ show: true, type: 'danger', message: 'Failed to load user profile.' });
      //   } else {
      //     setProfile(profileData);
      //   }
      // } else {
      //   setProfile(null);
      // }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const employeeSignIn = async (email, password) => {
    const { data: employeeRequest, error } = await supabase
      .from('employee_requests')
      .select('request_status, business_id')
      .eq('email', email)
      .single();
      
    if (employeeRequest) {
      const { request_status, business_id } = employeeRequest;
  
      if (request_status === 'pending' || request_status === 'rejected') {
        setToast({
          show: true,
          type: 'warning',
          message: `Your request for business ${business_id} is ${request_status}.`,
        });
        return;
      }
  
      if (request_status === 'approved') {
        navigate('/create-password', { state: { email } });
        return;
      }
    }
  
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setToast({ show: true, type: 'danger', message: signInError.message });
    }
  };
  
  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setToast({ show: true, type: 'danger', message: error.message });
    }
    else{
      navigate('/');
    }
  };

  const businessSignUp = async ({ firstName, lastName, email, password, phone, businessName, businessContact, businessEmail, businessSlogan, businessAddress }) => {
    const { error } = await supabase.auth.signUp({
      email: email ? email : null,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          user_role: 'Business Owner',
          business_name: businessName,
          business_contact: businessContact,
          business_email: businessEmail,
          business_slogan: businessSlogan,
          business_address: businessAddress,
        },
      },
    });
    
    if (error) {
      setToast({ show: true, type: 'danger', message: error.message });
    }
    else{
      navigate('/');
    }
  };

  const checkRequest = async ({email}) => {
    const { data,  error } = await supabase
      .from('employee_requests')
      .select('*')
      .eq('email',email)
      .single();

    if(error){
      setToast({
        show: true,
        type: 'warning',
        message: 'Error checking request status.'
      })
      return;
    }
    else{
      setToast({
        show: true,
        type: 'info',
        message: `The request for ${email} associated with ${data.business_id} business is: ${data.request_status}`
      })
      return data;
    }
  }

  const employeeSignUp = async({firstName, lastName, email, password, phone, businessId,businessUid}) => {
    const { error } = await supabase.auth.signUp({
      email: email ? email : null,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          user_role: 'Employee',
          business_id: businessId,
          business_uid: businessUid
        },
      },
    });
    
    if (error) {
      setToast({ show: true, type: 'danger', message: error.message });
    }
      else {
        navigate('/');
      }
  }

  const newEmployeeSignUp = async ({ firstName, lastName, email, phone, businessId }) => {
      const { error } = await supabase
      .from('employee_requests')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        business_id: businessId,
      });
  
    if (error) {
      setToast({ show: true, type: 'danger', message: error.message });
    } else {
      setToast({ show: true, type: 'success', message: 'Request submitted successfully' });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setToast({ show: true, type: 'info', message: 'Successfully signed out!' });
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, businessSignUp, employeeSignUp, newEmployeeSignUp, signOut, employeeSignIn, checkRequest }}>
      {children}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={handleToastClose}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
