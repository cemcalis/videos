interface CategoryPillProps {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryPill = ({ name, isActive = false, onClick }: CategoryPillProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        isActive 
          ? 'bg-primary text-primary-foreground hdyatak-glow' 
          : 'bg-secondary text-foreground hover:bg-secondary/80'
      }`}
    >
      {name}
    </button>
  );
};

export default CategoryPill;
