import { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaTimes } from 'react-icons/fa'

// Simple Q&A database in Bangla
const QA_DATABASE = {
  'হ্যালো': 'হ্যালো, আমি আপনার স্বাস্থ্য সহায়ক। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
  'নমস্কার': 'নমস্কার, আমি আপনার স্বাস্থ্য সহায়ক। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
  'কেমন আছেন': 'আমি ভালো আছি, ধন্যবাদ! আপনি কীভাবে আছেন?',
  'ডাক্তার': 'আপনি ডাক্তার খুঁজতে পারেন "ডাক্তার খুঁজুন" সেকশনে। সমস্যা অনুযায়ী ডাক্তার খুঁজে নিন।',
  'হাসপাতাল': 'আপনি নিকটস্থ হাসপাতাল খুঁজতে পারেন "নিকটস্থ ক্লিনিক" সেকশনে।',
  'জরুরি': 'জরুরি অবস্থায় পুলিশ, অ্যাম্বুলেন্স বা ফায়ার সার্ভিসের জন্য ৯৯৯ নম্বরে কল করুন।',
  'মুড': 'আপনি "মুড ট্র্যাকার" সেকশনে আপনার মানসিক অবস্থা ট্র্যাক করতে পারেন।',
  'সাহায্য': 'আপনি "সাহায্য চান" সেকশনে গোপনে সাহায্যের অনুরোধ করতে পারেন।',
  'রোগ': 'আপনি "মৌসুমি রোগ" সেকশনে বিভিন্ন মৌসুমের রোগ সম্পর্কে জানতে পারেন।',
  'ডেঙ্গু': 'ডেঙ্গু একটি মশাবাহিত রোগ যা বর্ষাকালে বেশি দেখা যায়। মশারি ব্যবহার করুন এবং পানি জমতে দেবেন না।',
  'সর্দি': 'সর্দি-কাশি হলে গরম পানি পান করুন, বিশ্রাম নিন এবং ভিটামিন সি খান।',
  'জ্বর': 'জ্বর হলে পর্যাপ্ত পানি পান করুন, বিশ্রাম নিন এবং প্রয়োজন হলে ডাক্তারের পরামর্শ নিন।',
  'ডায়রিয়া': 'ডায়রিয়া হলে ওআরএস পান করুন এবং তরল খাবার খান। যদি ২৪ ঘন্টার বেশি হয়, ডাক্তারের কাছে যান।',
  'নম্বর': 'জরুরি নম্বর: পুলিশ, অ্যাম্বুলেন্স, ফায়ার সার্ভিস - ৯৯৯। জাতীয় হেল্পলাইন - ১০৯।',
  'ধন্যবাদ': 'আপনাকে স্বাগতম। আরো কিছু জানতে চান?',
  'থাকবে': 'ধন্যবাদ। আপনার আরো কোনো প্রশ্ন থাকলে জানাবেন।',
  'শেষ': 'আপনাকে ধন্যবাদ। আপনার স্বাস্থ্য ভালো রাখুন।',
}

// Helper function to find best match
function findAnswer(question) {
  const lowerQuestion = question.toLowerCase().trim()
  
  // Direct match
  if (QA_DATABASE[lowerQuestion]) {
    return QA_DATABASE[lowerQuestion]
  }
  
  // Keyword matching
  for (const [key, answer] of Object.entries(QA_DATABASE)) {
    if (lowerQuestion.includes(key) || key.includes(lowerQuestion)) {
      return answer
    }
  }
  
  // Default responses
  if (lowerQuestion.includes('কি') || lowerQuestion.includes('কী') || lowerQuestion.includes('কেন')) {
    return 'আমি আপনাকে স্বাস্থ্য সম্পর্কিত তথ্য দিতে পারি। আপনি ডাক্তার, হাসপাতাল, জরুরি নম্বর, রোগ ইত্যাদি সম্পর্কে জানতে পারেন।'
  }
  
  return 'দুঃখিত, আমি আপনার প্রশ্নটি বুঝতে পারিনি। অনুগ্রহ করে আবার প্রশ্ন করুন বা "ডাক্তার", "হাসপাতাল", "জরুরি" ইত্যাদি সম্পর্কে জানতে পারেন।'
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported')
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'bn-BD' // Bangla (Bangladesh)

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setTranscript(transcript)
      handleQuestion(transcript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'no-speech') {
        setResponse('কোনো শব্দ শোনা যায়নি। অনুগ্রহ করে আবার বলুন।')
      }
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  function startListening() {
    if (!recognitionRef.current) {
      setResponse('দুঃখিত, আপনার ব্রাউজার voice recognition সমর্থন করে না।')
      return
    }

    try {
      setTranscript('')
      setResponse('')
      setIsListening(true)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
      setResponse('মাইক্রোফোন চালু করতে সমস্যা হয়েছে।')
    }
  }

  function stopListening() {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  function handleQuestion(question) {
    const answer = findAnswer(question)
    setResponse(answer)
    speakAnswer(answer)
  }

  function speakAnswer(text) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis not supported')
      return
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'bn-BD' // Bangla
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#33415c] hover:bg-[#33415c]/90 text-white p-5 rounded-full shadow-2xl z-50 transition-all hover:scale-110 flex items-center justify-center group"
        title="Voice Assistant"
      >
        <FaMicrophone className="text-2xl" />
        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Voice Assistant
        </span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 w-96 max-w-[calc(100vw-2rem)] border-2 border-[#33415c] overflow-hidden">
      {/* Header */}
      <div className="bg-[#33415c] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FaMicrophone className="text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Voice Assistant</h3>
            <p className="text-xs text-white/90">আপনার প্রশ্ন করুন</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(false)
            stopListening()
            stopSpeaking()
          }}
          className="text-white hover:text-gray-200 transition"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Transcript */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">আপনার প্রশ্ন:</p>
            <p className="text-gray-800 font-medium">{transcript}</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start gap-2 mb-2">
              <FaVolumeUp className="text-blue-600 mt-1" />
              <p className="text-xs text-blue-600 font-semibold">উত্তর:</p>
            </div>
            <p className="text-gray-800 leading-relaxed">{response}</p>
          </div>
        )}

        {/* Instructions */}
        {!transcript && !response && (
          <div className="text-center py-8 space-y-3">
            <div className="mx-auto w-16 h-16 bg-[#33415c]/10 rounded-full flex items-center justify-center">
              <FaMicrophone className="text-3xl text-[#33415c]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">কথা বলুন</p>
              <p className="text-sm text-gray-600">মাইক্রোফোন বোতাম চেপে আপনার প্রশ্ন করুন</p>
            </div>
            <div className="text-xs text-gray-500 mt-4 space-y-1">
              <p>উদাহরণ:</p>
              <p>• "ডাক্তার খুঁজুন"</p>
              <p>• "জরুরি নম্বর"</p>
              <p>• "ডেঙ্গু সম্পর্কে"</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Controls */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
          className={`p-4 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-[#33415c] hover:bg-[#33415c]/90 text-white'
          } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <FaMicrophoneSlash className="text-2xl" />
          ) : (
            <FaMicrophone className="text-2xl" />
          )}
        </button>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold text-gray-700"
          >
            থামান
          </button>
        )}
      </div>
    </div>
  )
}

