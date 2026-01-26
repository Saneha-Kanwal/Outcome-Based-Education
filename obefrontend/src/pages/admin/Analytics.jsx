import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import api from '../../services/api';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const fetchMetrics = useCallback(
    async (opts = { silent: false }) => {
      if (!opts.silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      try {
        const { data } = await api.get('/analytics/summary');
        setMetrics(data);
        if (opts.silent) {
          showToast('Analytics refreshed.', 'success');
        }
      } catch (error) {
        console.error('Error loading analytics summary:', error);
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to load analytics summary.';
        showToast(message, 'error');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const cards = useMemo(() => {
    if (!metrics) {
      return [];
    }

    return [
      {
        title: 'Total Students',
        value: metrics.total_students ?? 0,
        description: 'Active student accounts in the system.',
      },
      {
        title: 'Total Teachers',
        value: metrics.total_teachers ?? 0,
        description: 'Teacher accounts managing courses.',
      },
      {
        title: 'Total Courses',
        value: metrics.total_courses ?? 0,
        description: 'Courses currently available (not archived).',
      },
      {
        title: 'Program Outcomes (PLOs)',
        value: metrics.total_plos ?? 0,
        description: 'Program-level learning outcomes defined by admins.',
      },
      {
        title: 'Course Outcomes (CLOs)',
        value: metrics.total_clos ?? 0,
        description: 'Course-level outcomes linked to specific courses.',
      },
      {
        title: 'Total Outcomes',
        value: metrics.total_outcomes ?? 0,
        description: 'Combined PLOs and CLOs defined in the system.',
      },
    ];
  }, [metrics]);

  return (
    <>
      <Navbar />
      <div className="admin-analytics-page">
        <header className="analytics-header">
          <div>
            <h1>Analytics Overview</h1>
            <p>High-level metrics to help administrators monitor adoption and progress.</p>
          </div>
          <Button variant="secondary" onClick={() => fetchMetrics({ silent: true })} loading={refreshing}>
            Refresh
          </Button>
        </header>

        {loading ? (
          <div className="analytics-loading">
            <Loading message="Loading analytics..." />
          </div>
        ) : (
          <section className="analytics-cards">
            {cards.map((card) => (
              <article className="analytics-card" key={card.title}>
                <h2>{card.title}</h2>
                <p className="analytics-value">{card.value}</p>
                <p className="analytics-description">{card.description}</p>
              </article>
            ))}
          </section>
        )}
      </div>

      <Toast
        key={toast.timestamp}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default AdminAnalytics;

