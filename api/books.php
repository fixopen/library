<?php

class books
{

    private static $tableName = 'book';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
    }

    private $name = ''; //character varying(256),
    private $author = ''; //character varying(128),
    private $authorAlias = ''; //character varying(128),
    private $publisher = ''; //character varying(256),
    private $publishTime = ''; //character varying(16),
    private $isbn = ''; //character varying(24),
    private $standardClassify = ''; //character varying(16),
    private $firstLevelClassify = ''; //character varying(16),
    private $secondLevelClassify = ''; //character varying(16),
    private $authorizationEndTime = ''; //timestamp(4) without time zone,
    private $keywords = ''; //character varying(256),
    private $abstract = ''; //text,
    private $order = ''; //bigint,
    private $resourceId = ''; //bigint,
    private $lastUpdateTime = ''; //timestamp(4) without time zone,
    private $mimeType = '';

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * @param string $author
     */
    public function setAuthor($author)
    {
        $this->author = $author;
    }

    /**
     * @return string
     */
    public function getAuthorAlias()
    {
        return $this->authorAlias;
    }

    /**
     * @param string $authorAlias
     */
    public function setAuthorAlias($authorAlias)
    {
        $this->authorAlias = $authorAlias;
    }

    /**
     * @return string
     */
    public function getPublisher()
    {
        return $this->publisher;
    }

    /**
     * @param string $publisher
     */
    public function setPublisher($publisher)
    {
        $this->publisher = $publisher;
    }

    /**
     * @return string
     */
    public function getPublishTime()
    {
        return $this->publishTime;
    }

    /**
     * @param string $publishTime
     */
    public function setPublishTime($publishTime)
    {
        $this->publishTime = $publishTime;
    }

    /**
     * @return string
     */
    public function getIsbn()
    {
        return $this->isbn;
    }

    /**
     * @param string $isbn
     */
    public function setIsbn($isbn)
    {
        $this->isbn = $isbn;
    }

    /**
     * @return string
     */
    public function getStandardClassify()
    {
        return $this->standardClassify;
    }

    /**
     * @param string $standardClassify
     */
    public function setStandardClassify($standardClassify)
    {
        $this->standardClassify = $standardClassify;
    }

    /**
     * @return string
     */
    public function getFirstLevelClassify()
    {
        return $this->firstLevelClassify;
    }

    /**
     * @param string $firstLevelClassify
     */
    public function setFirstLevelClassify($firstLevelClassify)
    {
        $this->firstLevelClassify = $firstLevelClassify;
    }

    /**
     * @return string
     */
    public function getSecondLevelClassify()
    {
        return $this->secondLevelClassify;
    }

    /**
     * @param string $secondLevelClassify
     */
    public function setSecondLevelClassify($secondLevelClassify)
    {
        $this->secondLevelClassify = $secondLevelClassify;
    }

    /**
     * @return string
     */
    public function getAuthorizationEndTime()
    {
        return $this->authorizationEndTime;
    }

    /**
     * @param string $authorizationEndTime
     */
    public function setAuthorizationEndTime($authorizationEndTime)
    {
        $this->authorizationEndTime = $authorizationEndTime;
    }

    /**
     * @return string
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

    /**
     * @param string $keywords
     */
    public function setKeywords($keywords)
    {
        $this->keywords = $keywords;
    }

    /**
     * @return string
     */
    public function getAbstract()
    {
        return $this->abstract;
    }

    /**
     * @param string $abstract
     */
    public function setAbstract($abstract)
    {
        $this->abstract = $abstract;
    }

    /**
     * @return string
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @param string $order
     */
    public function setOrder($order)
    {
        $this->order = $order;
    }

    /**
     * @return string
     */
    public function getResourceId()
    {
        return $this->resourceId;
    }

    /**
     * @param string $resourceId
     */
    public function setResourceId($resourceId)
    {
        $this->resourceId = $resourceId;
    }

    /**
     * @return string
     */
    public function getLastUpdateTime()
    {
        return $this->lastUpdateTime;
    }

    /**
     * @param string $lastUpdateTime
     */
    public function setLastUpdateTime($lastUpdateTime)
    {
        $this->lastUpdateTime = $lastUpdateTime;
    }

    /**
     * @return string
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * @param string $mimeType
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
    } //character varying(32),


}

?>
