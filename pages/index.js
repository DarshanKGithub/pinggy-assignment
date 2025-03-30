import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    authCode: ''
  });

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/list', {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Is the backend running?');
      console.error('Fetch error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load posts on page load
  useEffect(() => {
    fetchPosts();
  }, []);


  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Safer validation - convert to string first if needed
      const authCodeValue = String(formData.authCode || '').trim();
      if (!authCodeValue) {
        throw new Error("Auth Code is required");
      }
  
      await axios.post('http://localhost:8081/post', 
        {
          title: formData.title,
          body: formData.body
        },
        {
          headers: {
            PinggyAuthHeader: authCodeValue // Use the validated value
          }
        }
      );
  
      setFormData({ title: '', body: '', authCode: '' });
      await fetchPosts();
    } catch (err) {
      setError(err.message || 'Failed to create post');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Pinggy Posts</title>
        <meta name="description" content="Post submission and viewing application" />
      </Head>

      <main className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Pinggy Posts</h1>
        
        {/* Submission Form */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="body" className="block text-gray-700 font-medium mb-2">
                Body
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="authCode" className="block text-gray-700 font-medium mb-2">
                Auth Code
              </label>
              <input
                type="text"
                id="authCode"
                name="authCode"
                value={formData.authCode}
              onChange={(e) => setFormData({...formData, authCode: e.target.value})}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {loading ? 'Submitting...' : 'Submit Post'}
            </button>
          </form>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Posts List */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Posts</h2>
          
          {loading && posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts available yet</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <article key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-3 whitespace-pre-line">{post.body}</p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Auth:</span> {post.pinggyAuthHeader}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}