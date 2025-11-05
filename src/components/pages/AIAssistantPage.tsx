import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../lib/AppContext';
import { PageLayout } from '../PageLayout';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MemberAvatar } from '../MemberAvatar';
import { Bot, Send, Sparkles, TrendingDown, PiggyBank, BarChart3 } from 'lucide-react';

export function AIAssistantPage() {
  const { aiMessages, sendAIMessage, currentUser, projects } = useApp();
  const [message, setMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      await sendAIMessage(message, selectedProject);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    { text: "How can I reduce my spending?", icon: TrendingDown },
    { text: "Am I overspending in any category?", icon: BarChart3 },
    { text: "Suggest a budget plan", icon: PiggyBank },
    { text: "Analyze my top 3 categories", icon: Sparkles }
  ];

  return (
    <PageLayout maxWidth="medium">
      <PageHeader
        title="AI Budget Assistant"
        description="Get personalized insights and recommendations"
      />

      {/* Project Context Selector */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <label htmlFor="project-context" className="text-sm text-muted-foreground">
              Project Context:
            </label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger id="project-context" className="w-[250px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="rounded-full bg-primary p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                  </div>
                )}
                
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <time
                    className={`text-xs mt-2 block ${
                      msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                    dateTime={msg.timestamp}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </time>
                </div>

                {msg.role === 'user' && currentUser && (
                  <MemberAvatar
                    name={currentUser.name}
                    avatar={currentUser.avatar}
                    size="md"
                    showTooltip={false}
                  />
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="rounded-full bg-primary p-2 h-10 w-10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground animate-pulse" aria-hidden="true" />
                </div>
                <div className="rounded-lg p-4 bg-muted">
                  <p className="text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Suggested Prompts */}
      {aiMessages.length <= 1 && (
        <div className="mb-4">
          <p className="text-muted-foreground mb-3">Suggested questions:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setMessage(prompt.text)}
                className="justify-start gap-2 h-auto py-3 px-4"
              >
                <prompt.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="text-left">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your finances..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
              aria-label="Message to AI assistant"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send
          </p>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
