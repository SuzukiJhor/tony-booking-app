export default function TitlePage({ title }: { title: string }) {
    return (
        <h1
            className="
                text-sky-700
                dark:text-primary
                text-2xl md:text-3xl 
                font-extrabold 
                pb-4 md:pb-8
                relative

                after:content-['']
                after:block
                after:w-12 md:after:w-16
                after:h-1
                after:mt-2
                after:bg-sky-700
                dark:after:bg-primary
                after:transition-all
            "
        >
            {title}
        </h1>
    );
}