
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers'; // Now correctly imported
import { 
  Save, 
  Play, 
  X, 
  Plus, 
  Settings, 
  MessageSquare, 
  LayoutGrid,
  AlertTriangle,
  ArrowRight,
  Check,
  Users,
  PipetteIcon,
  ZapIcon,
  CalendarCheck,
  Mail,
  Clock,
  Filter,
  PanelLeft,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AutomationBlock } from '@/components/automations/AutomationBlock';
import { AutomationCanvas } from '@/components/automations/AutomationCanvas';
import { AutomationSidebar } from '@/components/automations/AutomationSidebar';
import { AutomationFlowPreview } from '@/components/automations/AutomationFlowPreview';
import { PreviewDialog } from '@/components/automations/PreviewDialog';
import { TemplatesDialog } from '@/components/automations/TemplatesDialog';
import { useParams, useNavigate } from 'react-router-dom';
import { Block, BlockType, BlockCategory } from '@/types/automation';

const AutomacaoEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automationName, setAutomationName] = useState(id ? 'Editar Automação' : 'Nova Automação');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    
    // If dragging from sidebar, create a new block
    if (typeof active.id === 'string' && active.id.startsWith('template-')) {
      const blockType = active.id.replace('template-', '') as BlockType;
      let category: BlockCategory;
      
      if (['new_lead', 'lead_moved', 'message_received'].includes(blockType)) {
        category = 'trigger';
      } else if (['lead_status', 'lead_source', 'value_greater'].includes(blockType)) {
        category = 'condition';
      } else {
        category = 'action';
      }
      
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: blockType,
        category,
        position: { x: 100, y: 100 },
        configured: false,
        config: {},
        connections: []
      };
      
      setActiveBlock(newBlock);
    } else {
      // If dragging an existing block, set it as active
      const blockId = active.id.toString();
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        setActiveBlock(block);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    
    if (activeBlock) {
      // If dragging from sidebar, add new block to canvas
      if (!blocks.some(b => b.id === activeBlock.id)) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          // Calculate position relative to canvas
          const x = event.delta.x + 100;
          const y = event.delta.y + 100;
          
          setBlocks([...blocks, {...activeBlock, position: { x, y }}]);
        }
      } else {
        // If dragging existing block, update its position
        setBlocks(blocks.map(block => {
          if (block.id === activeBlock.id) {
            return {
              ...block,
              position: {
                x: block.position.x + event.delta.x,
                y: block.position.y + event.delta.y
              }
            };
          }
          return block;
        }));
      }
    }
    
    setActiveBlock(null);
  };

  const handleSaveAutomation = () => {
    const invalidBlocks = blocks.filter(block => !block.configured);
    
    if (invalidBlocks.length > 0) {
      toast.error('Há blocos não configurados na sua automação.');
      return;
    }
    
    if (blocks.filter(b => b.category === 'trigger').length === 0) {
      toast.error('Sua automação precisa de pelo menos um gatilho.');
      return;
    }
    
    toast.success('Automação salva com sucesso!');
    navigate('/automacoes');
  };

  const handleTestAutomation = () => {
    toast.info('Testando automação...');
    setTimeout(() => {
      toast.success('Teste concluído com sucesso!');
    }, 1500);
  };

  const handleCancelAutomation = () => {
    navigate('/automacoes');
  };

  const handleConfigureBlock = (blockId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, configured: true };
      }
      return block;
    }));
    
    toast.success('Bloco configurado com sucesso!');
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    toast.success('Bloco removido.');
  };

  const handleCreateConnection = (fromBlockId: string, toBlockId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === fromBlockId) {
        return {
          ...block,
          connections: [...block.connections, toBlockId]
        };
      }
      return block;
    }));
  };

  const handleApplyTemplate = (templateBlocks: Block[]) => {
    setBlocks(templateBlocks);
    setShowTemplates(false);
    toast.success('Template aplicado com sucesso!');
  };

  return (
    <>
      <Helmet>
        <title>{automationName} | ResolveClick</title>
      </Helmet>
      
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="bg-white border-b px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{automationName}</h1>
            <p className="text-muted-foreground text-sm">Construtor visual de automação</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleTestAutomation} variant="outline" className="hidden md:flex">
              <Play className="mr-2 h-4 w-4" />
              Testar
            </Button>
            <Button onClick={handleSaveAutomation} className="bg-pink-600 hover:bg-pink-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Salvar</span>
            </Button>
            <Button onClick={handleCancelAutomation} variant="ghost">
              <X className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 h-full">
          {/* Sidebar with block library */}
          <AutomationSidebar 
            onShowTemplates={() => setShowTemplates(true)}
            isMobile={isMobile}
          />
          
          {/* Main canvas area */}
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <main className="flex-1 overflow-hidden bg-gray-50 relative">
              <AutomationCanvas 
                blocks={blocks}
                canvasRef={canvasRef}
                onConfigureBlock={handleConfigureBlock}
                onDeleteBlock={handleDeleteBlock}
                onCreateConnection={handleCreateConnection}
              />
              
              {/* Canvas controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button 
                  onClick={() => setShowPreview(true)} 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white shadow-md"
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  Ver como Fluxo
                </Button>
              </div>
            </main>
          </DndContext>
        </div>
      </div>
      
      {/* Template dialog */}
      <TemplatesDialog 
        open={showTemplates} 
        onOpenChange={setShowTemplates} 
        onApplyTemplate={handleApplyTemplate}
      />
      
      {/* Preview dialog */}
      <PreviewDialog 
        open={showPreview} 
        onOpenChange={setShowPreview} 
        blocks={blocks} 
      />
    </>
  );
};

export default AutomacaoEditorPage;
