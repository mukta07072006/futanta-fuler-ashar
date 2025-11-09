import { useEffect, useMemo, useState } from 'react'
import CountdownTimer from '../components/CountdownTimer'
import { getList } from '../services/api'

function parseDate(val) {
  // Supports Firestore Timestamp, ISO string, or number
  try {
    if (!val) return null
    if (typeof val?.toDate === 'function') return val.toDate()
    if (typeof val === 'string') return new Date(val)
    if (typeof val === 'number') return new Date(val)
    return null
  } catch {
    return null
  }
}

function EventTimer({ event }) {
  const now = new Date()
  const eventDate = parseDate(event.date)
  
  if (!eventDate || !(eventDate instanceof Date) || isNaN(eventDate)) {
    return null // No timer if no valid date
  }
  
  if (eventDate < now) {
    return (
      <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        সম্পন্ন হয়েছে
      </div>
    )
  }
  
  return <CountdownTimer targetDate={eventDate} />
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getList('events')
        setEvents(list.map(it => ({ id: it._id || it.id, ...it })))
      } catch (e) {
        console.error('Failed to load events', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const now = new Date()
  const { upcomingEvents, pastEvents, eventsWithoutDate } = useMemo(() => {
    const withDates = events
      .map(e => ({ ...e, _date: parseDate(e.date) }))
      .filter(e => e._date instanceof Date && !isNaN(e._date))

    const future = withDates.filter(e => e._date >= now).sort((a, b) => a._date - b._date)
    const past = withDates.filter(e => e._date < now).sort((a, b) => b._date - a._date)
    const noDate = events.filter(e => !parseDate(e.date) || !(parseDate(e.date) instanceof Date))

    return {
      upcomingEvents: future,
      pastEvents: past,
      eventsWithoutDate: noDate
    }
  }, [events])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ইভেন্ট লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  // Function to handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // Function to close modal
  const handleCloseModal = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative">
              {selectedEvent.thumbnail ? (
                <img 
                  src={selectedEvent.thumbnail} 
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
              ) : (
                <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-t-xl">
                  <span className="text-white text-6xl">🎉</span>
                </div>
              )}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Event Date */}
              {selectedEvent._date && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {selectedEvent._date.toLocaleDateString('bn-BD', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}

              {/* Event Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedEvent.title}
              </h2>

              {/* Event Description */}
              {selectedEvent.description && (
                <div className="prose prose-gray mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Additional Event Details */}
              <div className="border-t pt-4">
                <div className="flex justify-center">
                  <EventTimer event={selectedEvent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ফুটন্ত ফুলের আসর ইভেন্টস</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            আমাদের আসন্ন এবং পূর্ববর্তী সকল ইভেন্টসমূহ
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            আসন্ন ইভেন্টসমূহ
          </h2>
          
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">কোনো আসন্ন ইভেন্ট নেই</h3>
              <p className="text-gray-600">শীঘ্রই নতুন ইভেন্ট আসছে!</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${upcomingEvents.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} justify-items-center`}>
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col w-full max-w-xl mx-auto min-h-[22rem] cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  {/* Event Thumbnail */}
                  {event.thumbnail ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.thumbnail} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl">🎉</span>
                    </div>
                  )}

                  {/* Event Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Event Date */}
                    {event._date && (
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {event._date.toLocaleDateString('bn-BD', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}

                    {/* Event Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    {event.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {event.description}
                      </p>
                    )}

                    {/* Timer or Completed Status */}
                    <div className="mt-auto flex justify-center">
                      <EventTimer event={event} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              সম্পন্ন ইভেন্টসমূহ
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEventClick(event)}
                >
                  {/* Event Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>

                  {/* Event Date */}
                  {event._date && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {event._date.toLocaleDateString('bn-BD', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  {/* Completed Status */}
                  <div className="mt-2 flex justify-center">
                    <EventTimer event={event} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events Without Date */}
        {eventsWithoutDate.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              অনির্দিষ্ট তারিখের ইভেন্ট
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventsWithoutDate.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-400 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEventClick(event)}
                >
                  {/* Event Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-gray-600">
                      {event.description}
                    </p>
                  )}

                  {/* No Date Info */}
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    তারিখ নির্ধারণ করা হয়নি
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}