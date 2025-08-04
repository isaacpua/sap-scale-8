import { useState, useRef, useEffect } from 'react';
import { Toast } from "@/components/ui/toast";
import { Button, Input, List, Icon } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/bell.js';
import '@ui5/webcomponents-icons/dist/paper-plane.js';
import '@ui5/webcomponents-icons/dist/minimize.js';
import '@ui5/webcomponents-icons/dist/resize.js';

interface NotificationButtonProps {
  isVisible: boolean;
  style?: React.CSSProperties;
  title?: string;
}

const NotificationButton = ({ isVisible, style, title = "Mini-Joule" }: NotificationButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  interface Message {
    text: string;
    isUser: boolean;
    isEmail?: boolean;
  }

  const [messages, setMessages] = useState<Message[]>([
    { text: "Maintenance for AZ6013 is 59 days overdue. Should I draft an email to request sending it for maintenance?", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Use a longer delay to ensure buttons are rendered
    const timeoutId = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Auto-scroll when chat is opened or reopened
  useEffect(() => {
    if (isDialogOpen && !isMinimized) {
      setTimeout(scrollToBottom, 200);
    }
  }, [isDialogOpen, isMinimized]);

  const handleChatOpen = () => {
    setIsDialogOpen(true);
    setIsMinimized(false);
    setHasBeenClicked(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isUser: true }]);
      setNewMessage("");
      
      // Simulate response after 1 second
      setTimeout(() => {
        const emailTemplate = `Subject: Urgent Maintenance Request for Aircraft AZ6013


Dear Operations Manager,

I hope this email finds you well. I am writing to bring to your attention that Aircraft AZ6013 is currently 59 days overdue for its scheduled maintenance check.

Key Details:

• Tail Number: AZ6013
• Model: Boeing 737
• Status: 59 days overdue for maintenance
• Priority: High
• Required Action: Immediate maintenance scheduling

Given the overdue status, I recommend scheduling this aircraft for maintenance at the earliest possible slot. This is crucial for maintaining our safety standards and regulatory compliance.

Please advise on the next available maintenance slot and any specific preparations required from our end.

Best regards,
[Your Name]
Aircraft Maintenance Division
`;

        setMessages(prev => [...prev, 
          { 
            text: "I've drafted an email to the Operations Manager regarding the maintenance for AZ6013. Here's the draft:", 
            isUser: false 
          },
          {
            text: emailTemplate,
            isUser: false,
            isEmail: true
          }
        ]);
      }, 1000);
    }
  };

  return (
    <>
      {isVisible && (
        <div style={{
          position: 'relative',
          display: 'inline-block',
          ...style
        }}>
          <Button 
            icon="bell"
            design="Negative"
            onClick={handleChatOpen}
            aria-label="Open chat"
            style={{
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              boxShadow: '0 2px 8px rgba(255, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              animation: hasBeenClicked ? 'none' : 'pulse 2s infinite'
            }}
          />
          <style>
            {`
              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
                }
                70% {
                  box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
                }
              }
              
              button:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3) !important;
              }
            `}
          </style>
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            display: hasBeenClicked ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            1
          </span>
        </div>
      )}

      {isDialogOpen && (
        <>
          {/* Full Chat Window */}
          {!isMinimized && (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '350px',
              height: '500px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              opacity: 1,
              transform: 'translateY(0)'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}>
                <span style={{ fontWeight: 600 }}>{title}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    icon="minimize"
                    design="Transparent"
                    onClick={() => setIsMinimized(true)}
                    style={{ padding: '4px' }}
                  />
                </div>
              </div>

              {/* Chat Messages */}
              <List
                style={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  padding: '1rem',
                  marginBottom: '0'
                }}
              >
                {messages.map((message, index) => {
                  // Check if the message contains email template
                  const isEmail = message.isEmail || message.text.startsWith('Subject:');
                  
                  return (
                    <div key={index} style={{ marginBottom: isEmail ? '16px' : '4px' }}>
                      <div
                        style={{
                          textAlign: message.isUser ? 'right' : 'left',
                          backgroundColor: message.isUser ? '#e8f4ff' : '#f8f9fa',
                          padding: isEmail ? '16px' : '8px 12px',
                          margin: '4px 0',
                          borderRadius: '12px',
                          maxWidth: isEmail ? '95%' : '80%',
                          marginLeft: message.isUser ? 'auto' : '0',
                          marginRight: message.isUser ? '0' : 'auto',
                          wordBreak: 'break-word',
                          whiteSpace: isEmail ? 'pre-line' : 'normal',
                          border: isEmail ? '1px solid #e5e7eb' : 'none',
                          fontFamily: isEmail ? 'monospace' : 'inherit',
                          fontSize: isEmail ? '13px' : 'inherit',
                          boxShadow: isEmail ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                      >
                        {message.text}
                      </div>
                      {isEmail && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end',
                          marginTop: '8px',
                          gap: '8px'
                        }}>
                          <Button
                            design="Positive"
                            onClick={() => {
                              setMessages(prev => [...prev, { 
                                text: "Email approved and sent to Operations Manager.", 
                                isUser: false 
                              }]);
                              setTimeout(scrollToBottom, 200);
                            }}
                          >
                            Approve & Send Email
                          </Button>
                          <Button
                            design="Transparent"
                            onClick={() => {
                              setMessages(prev => [...prev, { 
                                text: "Please let me know what changes you'd like to make to the email.", 
                                isUser: false 
                              }]);
                              setTimeout(scrollToBottom, 200);
                            }}
                          >
                            Request Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </List>

              {/* Chat Input */}
              <div style={{ 
                padding: '16px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '8px',
                backgroundColor: '#f8f9fa',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px'
              }}>
                <Input
                  style={{ flex: 1 }}
                  value={newMessage}
                  onInput={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                />
                <Button
                  icon="paper-plane"
                  onClick={handleSendMessage}
                  design="Emphasized"
                />
              </div>
            </div>
          )}

          {/* Minimized Chat Pill */}
          {isMinimized && (
            <div 
              onClick={() => setIsMinimized(false)}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#0A6ED1',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 1000,
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
            >
              <Icon name="resize" />
              <span style={{ fontWeight: 500 }}>{title}</span>
              {messages.length > 1 && (
                <div style={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginLeft: '4px'
                }}>
                  {messages.length - 1}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NotificationButton;