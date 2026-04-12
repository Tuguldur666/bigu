import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JobPostForm, Sidebar } from "../components/JobPostForm";
import api from "../api";

export default function JobPostPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await api.createJob(data)
      setFormData({ ...data, _id: result.job._id })
      setDone(true)
    } catch (error) {
      alert('Алдаа гарлаа: ' + error.message)
    } finally {
      setLoading(false)
    }
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setFormData(null);
    navigate('/dashboard');
  };

  const sal = formData?.salFrom || formData?.salTo
    ? (formData.salFrom ? Number(formData.salFrom).toLocaleString() : "") + (formData.salTo ? " – " + Number(formData.salTo).toLocaleString() : "") + " ₮"
    : "Тохиролцоно";

  if (done) return (
    <div className="success-page">
      <div className="success-page__icon">✓</div>
      <div className="success-page__title">Ажлын зар амжилттай нийтлэгдлээ!</div>
      <div className="success-page__subtitle">Таны зар шалгагдаж байна.<br />Ихэвчлэн 1–2 цагийн дотор идэвхжинэ.</div>
      <div className="success-page__card">
        <div className="success-page__job-title">{formData?.title}</div>
        <div className="success-page__company">{user?.companyName || 'Миний Компани'}</div>
        <div className="success-page__tags">
          {[formData?.type, formData?.sector, formData?.location].filter(Boolean).map(t => (
            <span key={t} className="success-page__tag">{t}</span>
          ))}
        </div>
        <div className="success-page__salary">💵 {sal}</div>
      </div>
      <button className="btn btn--outline" onClick={reset}>+ Шинэ зар нийтлэх</button>
    </div>
  );

  return (
    <div className="job-post">
      <div className="job-post__breadcrumb">Ажил олгогч / <span>Ажлын зар нийтлэх</span></div>
      <div className="job-post__title">Шинэ ажлын зар нийтлэх</div>
      <div className="job-post__form">
        <Sidebar currentStep={step} />
        <JobPostForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}