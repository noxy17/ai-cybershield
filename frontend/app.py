import streamlit as st
import requests

st.set_page_config(page_title="AI CyberShield", layout="wide")

# HEADER
st.markdown("""
    <h1 style='text-align: center; color: #00FFAA;'>🛡️ AI CyberShield</h1>
    <p style='text-align: center;'>Real-Time Phishing & Scam Detection System</p>
""", unsafe_allow_html=True)

# SIDEBAR
st.sidebar.title("📊 Dashboard")
st.sidebar.write("Total Scans: 128")
st.sidebar.write("Phishing Detected: 47")
st.sidebar.write("System Status: ✅ Active")

# MAIN LAYOUT
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("🔍 Scan Input")

    option = st.selectbox("Select Scan Type", ["Email/Text", "URL"])

    user_input = st.text_area("Enter content to analyze")

    analyze_btn = st.button("🚀 Analyze")

with col2:
    st.subheader("🧠 AI Insights")

    st.info("Results will appear here after analysis")

# RESULT SECTION
if analyze_btn and user_input:

    try:
        if option == "Email/Text":
            response = requests.post(
                "http://127.0.0.1:8000/predict",
                params={"text": user_input}
            )
        else:
            response = requests.post(
                "http://127.0.0.1:8000/predict-url",
                params={"url": user_input}
            )

        result = response.json()

        st.markdown("---")
        st.subheader("📊 Analysis Result")

        col3, col4 = st.columns(2)

        with col3:
            if result["prediction"] == "Phishing" or result["prediction"] == "Suspicious":
                st.error(f"🚨 {result['prediction']}")
            else:
                st.success(f"✅ {result['prediction']}")

        with col4:
            st.metric("Risk Score", f"{result['risk_score']}%")

        # Explainability (only for text)
        if option == "Email/Text":
            explain_res = requests.post(
                "http://127.0.0.1:8000/explain",
                params={"text": user_input}
            )

            explain_data = explain_res.json()

            st.subheader("⚠️ Suspicious Words Detected")
            st.write(explain_data["suspicious_words"])

    except:
        st.error("⚠️ Backend not running. Start FastAPI server.")

st.session_state.history.append({
    "prediction": result["prediction"],
    "risk": result["risk_score"]
})





# FOOTER
st.markdown("""
<hr>
<p style='text-align: center;'>Built for Hackathon 🚀 | AI CyberShield</p>
""", unsafe_allow_html=True)