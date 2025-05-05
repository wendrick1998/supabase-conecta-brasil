
interface ConversationListHeaderProps {
  title: string;
}

const ConversationListHeader = ({ title }: ConversationListHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-800 sticky top-0 bg-[#121212] z-10">
      <h1 className="text-xl font-bold mb-2 text-white text-left flex items-center">
        <span className="bg-gradient-to-r from-vendah-purple to-vendah-blue bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      <p className="text-sm text-gray-400 text-left">Gerencie suas conversas com leads</p>
    </div>
  );
};

export default ConversationListHeader;
