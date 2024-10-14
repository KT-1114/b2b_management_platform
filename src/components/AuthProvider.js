import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Toast from './Toast'; // Ensure you import your Toast component
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth State Changed', event);
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const employeeSignIn = async (email, password) => {
    const { data, error } = await supabase
      .from('employee_requests')
      .select('request_status, business_id')
      .eq('email', email)
      .single();
      console.log('emp data', data)
    if (data) {
      const { request_status, business_id } = employeeRequest;
  
      if (request_status === 'pending' || request_status === 'rejected') {
        // Show message about request status
        setToast({
          show: true,
          type: 'warning',
          message: `Your request for business ${business_id} is ${request_status}.`,
        });
        return;
      }
  
      if (request_status === 'approved') {
        // Prompt for password creation
        navigate('/create-password', { state: { email } });
        return;
      }
    }
  
    // If not an employee request, attempt normal sign-in
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
      console.error('Error during sign-up:', error.message);
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

  const employeeSignUp = async({firstName, lastName, email, password, phone, businessId,}) => {
    const { error } = await supabase.auth.signUp({
      email: email ? email : null,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          user_role: 'employee',
          business_id: businessId
        },
      },
    });
    
    if (error) {
      console.error('Error during sign-up:', error.message);
      setToast({ show: true, type: 'danger', message: error.message });
    }
    else{
      const {error} = await supabase
      .from('employee_requests')
      .delete()
      .eq('email', email)
      navigate('/');
    }
  }
  const newEmployeeSignUp = async ({ firstName, lastName, email, phone, businessId }) => {
    // const { data: existingRequest } = await supabase
    //   .from('employee_requests')
    //   .select('business_id, request_status')
    //   .eq('email', email);
  
    // if (existingRequest?.length > 0) {
    //   // Show message: There is an existing request for this email
    //   const { business_id, request_status } = existingRequest[0];
    //   setToast({
    //     show: true,
    //     type: 'info',
    //     message: `The request for ${email} associated with business ${business_id} is: ${request_status}`,
    //   });
    //   return;
    // }
  
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
    setToast({ show: true, type: 'info', message: 'Successfully signed out!' });
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, businessSignUp, employeeSignUp, newEmployeeSignUp, signOut, employeeSignIn, checkRequest }}>
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
