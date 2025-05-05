
interface ConversationListHeaderProps {
  title: string;
}

const ConversationListHeader = ({ title }: ConversationListHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-800 sticky top-0 bg-[#121212] z-10">
      <h1 className="text-xl font-bold mb-4 text-left">{title}</h1>
    </div>
  );
};

export default ConversationListHeader;
